const {
    Arrival,
    Order,
    Offer,
    Coupon,
    Partner,
    Outlet,
    OutletMenu,
    User,
} = require("../../models/index.models");
const { containerClient } = require("../../utils/index.utils");
const schedule = require("node-schedule");
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const handleEvent = async (outletId, userId, couponId, type) => {
    try {
        const coupon = await Coupon.findById(couponId);
        const offer = await Offer.findById(coupon.offer);
        const outlet = await Outlet.findById(outletId);
        const arrival = await Arrival.findOneAndUpdate(
            { offer: offer._id },
            {
                $setOnInsert: {
                    offer: offer._id,
                    time: new Date(coupon.time),
                    outlet: new ObjectId(outletId),
                },
            },
            { upsert: true, new: true }
        ).populate("guest");

        switch (type) {
            case "arrival":
                arrival.guest.push(userId);
                arrival.status = "active";
                const latestArrival = await arrival.save();
                if (arrival.guest.length === 2) {
                    //schedule a job to update the arrival status to done
                    let date = new Date();
                    date.setHours(date.getHours() + 1); // set the date 1 hours from now
                    schedule.scheduleJob(date, async function () {
                        arrival.status = "done";
                        arrival.arrivalTime = new Date();
                        await arrival.save();
                    });
                }
                console.log("arrival");
                return { latestArrival, pid: outlet.pid };
            case "process":
                const order = await Order.findOne({ arrivalId: arrival._id });
                const arr = [];
                if (offer.arrivalStatus.host) {
                    if (offer.orderDetails.forMe.item) {
                        arr.push(offer.orderDetails.forMe.item);
                    }
                }
                if (offer.arrivalStatus.guest) {
                    if (offer.orderDetails.forYou.item) {
                        arr.push(offer.orderDetails.forYou.item);
                    }
                }
                if (!order) {
                    const newOrder = new Order({
                        arrivalId: arrival._id,
                        item: arr,
                        table: arrival.table,
                        status: "active",
                        outlet: offer.outlet,
                    });

                    const latestOrder = await newOrder.save();
                    console.log("process");
                    return { latestOrder, pid: outlet.pid };
                } else {
                    order.item.push(coupon.item);
                    console.log("process");
                    const latestOrder = await order.save();
                    return { latestOrder, pid: outlet.pid };
                }
            case "alert":
                arrival.alert = true;
                const updatedArrival = await arrival.save();
                return { updatedArrival, pid: outlet.pid };
        }
    } catch (err) {
        console.log(err);
    }
};

const orderStatusUpdate = async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findById(orderId);
        order.status = "done";
        const updatedOrder = await Order.save();
        res.status(200).json({ order: updatedOrder });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getArrivalAndOrder = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const arrival = await Arrival.find({
            outlet: outlet._id,
            status: "active",
        }).populate("guest", "name");
        const order = await Order.find({
            outlet: outlet._id,
            status: "active",
        }).populate("item");

        res.status(200).json({ arrival, order });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getOrderHistory = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const page = req.query.page || 0;
        const limit = req.query.limit || 20;
        const total = await Order.countDocuments({
            outlet: outlet._id,
            status: "done",
        });
        const orders = await Order.find({
            outlet: outlet._id,
            status: "done",
        })
            .populate("item")
            .skip(page * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        const promises = orders.map(async (order) => {
            const arrival = await Arrival.findById(order.arrivalId).select(
                "time"
            );
            const total = order.item.reduce((acc, curr) => acc + curr.price, 0);
            return {
                ...order._doc,
                time: arrival.time,
                total: total,
            };
        });
        Promise.all(promises).then((orders) => {
            res.status(200).json({ orders, total });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getRevenue = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        // console.log(outlet);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const month = new Date();
        month.setDate(1);
        month.setHours(0, 0, 0, 0);

        // const todayBooking = await Order.find({
        // 	outlet: outlet._id,
        // 	createdAt: {
        // 		$gte: today,
        // 	},
        // }).populate('item');
        const allOrders = await Order.find({
            outlet: outlet._id,
            createdAt: {
                $gte: today,
            },
        }).populate("item");
        const todayOrder = {
            booking: 0,
            revenue: 0,
        };
        let totalRevenue = 0;

        allOrders.map((order) => {
            const orderAmount = order.item.reduce(
                (acc, curr) => acc + curr.price,
                0
            );
            if (order.createdAt >= today) {
                todayOrder.booking++;
                todayOrder.revenue += orderAmount;
            }
            totalRevenue += orderAmount;
        });
        const arrivals = await Arrival.find({
            outlet: outlet._id,
            time: { $gte: month },
            status: "done",
        });
        const monthCustomers = arrivals.reduce(
            (acc, curr) => acc + curr.guest.length,
            0
        );
        res.status(200).json({
            todayBooking: todayOrder.booking,
            todayRevenue: todayOrder.revenue,
            totalRevenue,
            monthCustomers,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getActiveArrivals = async (req, res) => {
    const pid = req.user.id;
    const pageSize = req.query.limit || 20;
    const page = req.query.page || 0;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const arrivals = await Arrival.find({
            outlet: outlet._id,
            status: "active",
        })
            .populate("offer")
            .populate("guest")
            .limit(pageSize)
            .skip(page * pageSize)
            .sort({ createdAt: -1 });
        const arrivalCount = await Arrival.countDocuments({
            outlet: outlet._id,
            status: "active",
        });
        const promises = arrivals.map(async (arrival) => {
            const order = await Order.findOne({
                arrivalId: arrival._id.toString(),
            }).populate("item");
            if (order) {
                const total = order.item.reduce(
                    (acc, curr) => acc + curr.price,
                    0
                );
                return {
                    ...arrival._doc,
                    order,
                    total,
                };
            } else {
                return { ...arrival._doc, order: {}, total: 0 };
            }
        });
        Promise.all(promises).then((arrivals) => {
            res.status(200).json({ arrivals: arrivals, total: arrivalCount });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};
const completeArrivalStatus = async (req, res) => {
    const arrivalId = req.body.arrivalId;
    try {
        const arrival = await Arrival.findById(arrivalId);
        const order = await Order.findOne({ arrivalId: arrivalId });
        arrival.status = "done";
        if (order) {
            order.status = "done";
            await order.save();
        }
        updatedArrival = await arrival.save();
        res.status(200).json({ arrival: updatedArrival });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateOutletStatus = async (req, res) => {
    const pid = req.user.id;
    const { status } = req.body;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        if (status === "open") {
            outlet.info.timing.status = "open";
        } else if (status === "closed") {
            outlet.info.timing.status = "closed";
        }
        const updatedOutlet = await outlet.save();
        res.status(200).json({ outlet: updatedOutlet });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};
const getOutlet = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        res.status(200).json({ outlet });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getUpcomingArrivals = async (req, res) => {
    const pid = req.user.id;
    const { page = 0, limit = 10 } = req.query;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const arrivals = await Arrival.find({
            outlet: outlet._id,
            status: "upcoming",
        })
            .skip(page * limit)
            .limit(limit)
            .populate([
                { path: "offer", populate: { path: "owner guest" } },
                { path: "guest" },
            ])
            .sort({ createdAt: -1 });

        const total = await Arrival.countDocuments({
            outlet: outlet._id,
            status: "upcoming",
        });
        res.status(200).json({ arrivals: arrivals, total });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const allotTable = async (req, res) => {
    const { arrivalId, table } = req.body;
    try {
        const arrival = await Arrival.findById(arrivalId);
        arrival.table = table;
        const updatedArrival = arrival.save();
        res.status(200).json({ arrival: updatedArrival });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};
const getMenuItems = async (req, res) => {
    const pid = req.user.id;
    const page = req.query.page || 0;
    const search = req.query.search
        ? { name: { $regex: req.query.search, $options: "i" } }
        : {};
    const pageSize = req.query.limit || 20;
    const filter = req.query.filter;
    const category = req.query.category;
    try {
        const query = filter ? { menuTitleTags: filter } : {};
        if (category) {
            query.nonVeg = category === "nonVeg";
        }
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({
            pid: partner._id.toString(),
        });
        console.log(outlet);
        const total = await OutletMenu.countDocuments({
            outletId: outlet._id.toString(),
            ...search,
            ...query,
        });
        const items = await OutletMenu.find({
            outletId: outlet._id.toString(),
            ...search,
            ...query,
        })
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .skip(page * pageSize);
        res.status(200).json({ items, total });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const addMenuItem = async (req, res) => {
    const pid = req.user.id;
    const { name, price, description, isBest, classification, category } =
        req.body;
    const files = req.files;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const data = {
            outletId: outlet._id.toString(),
            name: name,
            price: price,
            bio: description,
            menuTitleTags: [classification],
            nonVeg: category === "nonveg",
            image: [],
        };
        if (isBest) {
            data.menuTitleTags.push("bestseller");
        }
        if (files && files.length > 0) {
            for (const file of files) {
                const blobName = `${Date.now()}-${file.originalname}`;
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);

                await blockBlobClient.uploadData(file.buffer, {
                    blobHTTPHeaders: { blobContentType: file.mimetype },
                });
                const imageUrl = blockBlobClient.url;
                data.image.push(imageUrl);
            }
        }
        const menuItem = await OutletMenu.create(data);
        res.status(200).json({ item: menuItem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateMenuItemStatus = async (req, res) => {
    const { itemId, status } = req.body;
    try {
        const item = await OutletMenu.findById(itemId);
        if (status === "active") {
            item.status = "active";
        } else if (status === "inactive") {
            item.status = "inactive";
        }
        const updatedItem = await item.save();
        res.status(200).json({ item: updatedItem });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const deleteMenuItem = async (req, res) => {
    const itemId = req.params.itemId;
    try {
        await OutletMenu.findByIdAndDelete(itemId);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateMenuItem = async (req, res) => {
    const {
        itemId,
        name,
        price,
        description,
        isBest,
        classification,
        category,
    } = req.body;
    const files = req.files;
    try {
        const item = await OutletMenu.findById(itemId);
        if (item) {
            const images = [];
            if (files && files.length > 0) {
                for (const file of files) {
                    const blobName = `${Date.now()}-${file.originalname}`;
                    const blockBlobClient =
                        containerClient.getBlockBlobClient(blobName);

                    await blockBlobClient.uploadData(file.buffer, {
                        blobHTTPHeaders: { blobContentType: file.mimetype },
                    });
                    const imageUrl = blockBlobClient.url;
                    images.push(imageUrl);
                }
            }
            if (name) item.name = name;
            if (price) item.price = price;
            if (description) item.bio = description;
            item.nonVeg = category === "nonveg";
            item.menuTitleTags = [classification];
            if (isBest === true || isBest === "true") {
                item.menuTitleTags.push("bestSeller");
            } else if (isBest === false || isBest === "false") {
                item.menuTitleTags = item.menuTitleTags.filter(
                    (tag) => tag !== "bestSeller"
                );
            }
            item.image = images;
            const updatedItem = await item.save();
            res.status(200).json({ item: updatedItem });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getInprogressArrivals = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        const arrivals = await Arrival.find({
            outlet: outlet._id,
            status: "active",
        })
            .populate("offer")
            .populate("guest")
            .sort({ createdAt: -1 });
        res.status(200).json({ arrivals: arrivals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const resolveAlert = async (req, res) => {
    const { arrivalId, reason, resolution } = req.body;
    try {
        const arrival = await Arrival.findById(arrivalId);
        arrival.alert = false;
        arrival.alertReason = reason;
        arrival.alertResolution = resolution;
        const updatedArrival = await arrival.save();
        res.status(200).json({ arrival: updatedArrival });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getTodaysOrder = async (req, res) => {
    const pid = req.user.id;
    try {
        const partner = await Partner.findOne({ pAdminId: pid });
        const outlet = await Outlet.findOne({ pid: partner._id.toString() });
        // Get the current date in GMT
        const currentDate = new Date();
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);

        // Calculate the IST start of the day
        const startOfDayIST = new Date(startOfDay.getTime());

        // Calculate the IST end of the day
        const endOfDayIST = new Date(
            startOfDayIST.getTime() + 24 * 60 * 60 * 1000
        );

        const orders = await Order.find({
            outlet: outlet._id,
            createdAt: {
                $gte: startOfDayIST,
                $lte: endOfDayIST,
            },
        })
            .sort({ createdAt: -1 })
            .populate("item");
        const promises = orders.map(async (order) => {
            const arrival = await Arrival.findById(order.arrivalId);
            if (arrival.status !== "unassigned") {
                if (order.table !== arrival.table) {
                    order.table = arrival.table;
                    const updatedorder = await order.save();
                    return updatedorder;
                }
            }
            return order;
        });
        Promise.all(promises).then((orders) => {
            res.status(200).json({ orders });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};

const editOutlet = async (req, res) => {
    const {
        name,
        managerName,
        email,
        managerContact,
        openAt,
        closeAt,
        city,
        address,
        outletId,
    } = req.body;
    const files = req.files;
    try {
        const outlet = await Outlet.findById(outletId);

        if (outlet) {
            let image;
            if (files && files.length) {
                const blobName = `${Date.now()}-${files[0].originalname}`;
                const blockBlobClient =
                    containerClient.getBlockBlobClient(blobName);

                await blockBlobClient.uploadData(files[0].buffer, {
                    blobHTTPHeaders: { blobContentType: files[0].mimetype },
                });
                const imageUrl = blockBlobClient.url;
                image = imageUrl;
            }

            if (name) outlet.name = name;
            if (managerName) outlet.managerName = managerName;
            if (email) outlet.email = email;
            if (managerContact) outlet.managerContact = managerContact;
            if (openAt) outlet.openAt = openAt;
            if (closeAt) outlet.closeAt = closeAt;
            if (city) outlet.city = city;
            if (address) outlet.address = address;
            if (outletId) outlet.outletId = outletId;
            if (image) outlet.info.image = image;
        }

        // Save the updated outlet object
        const updatedOutlet = await outlet.save();
        console.log(updatedOutlet);
        res.status(200).json({ outlet: updatedOutlet });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
};
module.exports = {
    handleEvent,
    orderStatusUpdate,
    getArrivalAndOrder,
    getOrderHistory,
    getRevenue,
    getActiveArrivals,
    completeArrivalStatus,
    updateOutletStatus,
    getOutlet,
    getUpcomingArrivals,
    allotTable,
    getMenuItems,
    addMenuItem,
    updateMenuItemStatus,
    deleteMenuItem,
    updateMenuItem,
    getInprogressArrivals,
    resolveAlert,
    getTodaysOrder,
    editOutlet,
};
