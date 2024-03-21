const {
    User,
    UserSubscription,
    UserReferral,
    Coupon,
    Swipe,
    Offer,
    Outlet,
    Order,
    Ledger,
    Userquery,
    Room,
    Report,
    OutletMenu,
    UserCheck,
    Refund,
    Arrival,
    SubscriptionChecks,
} = require("../../models/index.models");
const containerClient = require("../../utils/blob/blob.utils");
const { sendPushNotification } = require("../../utils/notification.utils");

function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf("AM") != -1 && hours == 12) {
        time = time.replace("12", "0");
    }
    if (time.indexOf("PM") != -1 && hours < 12) {
        time = time.replace(hours, hours + 12);
    }
    return time.replace(/(AM|PM)/, "").trim();
}
function formatDate(dateString) {
    var options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    };
    const data = new Date(dateString).toLocaleDateString("en-US", options);
    const response = data.split(",").join("");
    return response;
}
const getUsers = async (req, res) => {
    const { page, search } = req.query;
    try {
        const pageNumber = page || 1;
        const pageSize = 20;
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        const users = await User.find(query)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 });
        const total = await User.countDocuments();
        const totalVerified = await User.countDocuments({ verified: true });
        const totalApproved = await User.countDocuments({
            claimOffer: true,
            verified: true,
            claimable: true,
        });
        const coffeeClaimed = await User.countDocuments({
            earlyBirdCouponClaimed: true,
        });
        const verificationDenied = await User.countDocuments({
            verificationDenied: true,
        });
        const maleCount = await User.countDocuments({
            gender: "Male",
        });
        const femaleCount = await User.countDocuments({
            gender: "Female",
        });
        const promises = users.map(async (user) => {
            const referral = await UserReferral({
                userId: user._id.toString(),
            });
            let referralStatus = false;
            if (!referral || !referral.referredTo) {
                return {
                    ...user._doc,
                    referralStatus: false,
                };
            }

            const referralArray = referral.male
                ? referral.male.concat(referral.female)
                : referral.female
                ? referral.female
                : [];

            let verifiedProfiles = 0;
            let femaleVerified = 0;
            await Promise.all(
                referralArray.map(async (id) => {
                    const referredUser = await User.findById(id);
                    if (
                        referredUser.verified &&
                        referredUser.image.length >= 3
                    ) {
                        verifiedProfiles++;
                        if (referredUser.gender.toLowerCase() === "female") {
                            femaleVerified++;
                        }
                    }
                })
            );

            if (verifiedProfiles >= 2) {
                referralStatus = true;
            }

            return {
                ...user._doc,
                referralStatus,
            };
        });
        Promise.all(promises).then((users) => {
            res.status(200).json({
                users,
                total,
                totalApproved,
                totalVerified,
                coffeeClaimed,
                verificationDenied,
                maleCount,
                femaleCount,
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getEarlyBirdUsers = async (req, res) => {
    const { page, search } = req.query;
    try {
        const pageNumber = page || 1;
        const pageSize = 20;
        const query = { earlyBird: true, jaipur: true };
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        const users = await User.find(query)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getEarlyBirdUserData = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userReferral = await UserReferral.findOne({ userId });

        if (!userReferral || !userReferral.referredTo) {
            return res
                .status(404)
                .json({ message: "User referral information not found" });
        }

        const referralCodeArray = [
            ...(userReferral.referredTo.male || []),
            ...(userReferral.referredTo.female || []),
        ];
        let verifiedReferrals = 0;
        // Use Promise.all to execute all promises concurrently
        const referrals = await Promise.all(
            referralCodeArray.map(async (code) => {
                const userData = await User.findById(code);
                // console.log(userData);
                if (!userData) {
                    return;
                }

                const image =
                    Array.isArray(userData.image) && userData.image.length
                        ? userData.image[0]
                        : null;

                const data = {
                    id: userData._id,
                    name: userData.name,
                    img: image,
                    verified: userData.verified,
                    profileCompletion: userData.profileCompletion,
                    referralSuccess:
                        userData.verified && userData.image.length >= 4,
                };
                if (userData.verified && userData.image.length >= 4) {
                    verifiedReferrals++;
                }
                return data;
            })
        );
        let status = false;
        if (user.gender.toLowerCase() === "female") {
            if (verifiedReferrals >= 3) {
                status = true;
            }
        } else {
            if (verifiedReferrals >= 2) {
                status = true;
            }
        }
        res.status(200).json({ user, referrals, referralStatus: status });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const approveStatusForCoupon = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        user.claimOffer = true;
        user.verified = true;
        user.claimable = true;
        await user.save();
        await sendPushNotification(
            user.deviceId,
            `Congratulation! Early user reward earned`,
            `Please select a coupon and time slot`
        );
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const verifyProfile = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        user.verified = true;
        if (user.verificationDenied === true) {
            user.verificationDenied = false;
        }
        const data = await UserCheck.findOne({ uid: userId });
        if (data) {
            if (data.freeOffer && data.offerId) {
                const offer = await Offer.findById(data.offerId);
                offer.status = "floating";
                user.offer = data.offerId;
                await offer.save();
                data.floatCount += 1;
            }
        }
        await data.save();
        await user.save();
        await sendPushNotification(
            user.deviceId,
            `Profile verification successful`,
            `Your profile is now verified`
        );
        res.status(200).json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const secondOffer = async (req, res) => {
    const { userId, days } = req.body;
    try {
        const user = await User.findById(userId);
        user.offerTwo.offerBool = true;
        user.offerTwo.days = days;
        await user.save();
        let currentDate = new Date();
        let compareDate = new Date(2023, 10, 18);
        if (currentDate < compareDate) {
            currentDate = compareDate;
        }
        currentDate.setDate(currentDate.getDate() + days);
        const data = new UserSubscription({
            name: "Referral Bonus",
            userId: userId,
            validity: {
                till: currentDate,
                days,
            },
            price: 0,
        });
        await data.save();
        await sendPushNotification(
            user.deviceId,
            `Congratulation! referral reward earned`,
            `You won ${days} days UMLA premium`
        );
        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const denyUserVerification = async (req, res) => {
    const { userId } = req.body;
    try {
        // Find the user by their ID
        const userData = await User.findById(userId);
        if (userData.verificationImage) {
            const parsedUrl = new URL(userData.verificationImage);

            // Get the image name from the pathname
            const imageName = parsedUrl.pathname.split("/").pop();

            // Get a block blob client
            const blockBlobClient =
                containerClient.getBlockBlobClient(imageName);

            // Delete the image
            await blockBlobClient.delete();
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                $unset: { verificationImage: 1 },
                $set: { verificationDenied: true },
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // send user notification
        await sendPushNotification(
            userData.deviceId,
            "Verification failed, Try again",
            "Please upload your picture in accordance with the instructions provided in the prompt"
        );

        res.status(200).json({
            message: "verificationImage unset successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getCoffeeClaimed = async (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 20;
    try {
        const coupons = await Coupon.find()
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate("item", "name price")
            .populate("outlet", "name")
            .populate("owner", "name whatsappNumber");
        const total = await Coupon.countDocuments();
        res.status(200).json({ coupons, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllUsers = async (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 50;
    const search = req.query.search;
    try {
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
        }
        const users = await User.find(query)
            .sort({ createdAt: -1 }) // Sorting in descending order
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select("name email location completed image")
            .lean() // Convert Mongoose document to plain JavaScript object for modification
            .exec(); // Execute the query

        // Loop through each user to extract the city from the location
        users.forEach((user) => {
            console.log(user.completed);
            if (user.completed === true) {
                const locationParts = user.location.split(","); // Split the location string into parts
                const cityIndex = locationParts.length - 3; // Get the index of the city
                user.city = locationParts[cityIndex].trim(); // Extract the city and add it to the user data
                user.image = user.image[0];
            }
        });

        const verifiedProfiles = await User.countDocuments({ verified: true });
        const unVerifiedProfiles = await User.countDocuments({
            verified: false,
        });
        res.status(200).json({ users, verifiedProfiles, unVerifiedProfiles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getUser = async (req, res) => {
    const userId = req.query.userId;
    try {
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
        }
        const user = await User.findById(userId);
        const swipe = await Swipe.findOne({ uid: userId });
        const offerCount = await Offer.countDocuments({
            status: { $in: ["consumed", "shared", "active"] },
        });
        const dealsCreated = await Offer.countDocuments({
            status: { $nin: ["paymentPending"] },
        });
        let lang = [];
        if (user.language) {
            lang = user.language[0].split(" ");
        }
        const info = {
            totalMatches: swipe.match.length,
            totalMeetUps: offerCount,
            totalSwipes: swipe.info?.swipeCount || 0,
            dealsCreated,
        };
        const userProfile = {
            name: user.name || "-",
            profileCompleted: user.completionPercentage || 0,
            profileVerification: user.verified,
            profileVerificationDenied:user.verificationDenied,
            profileBlocked:user.blocked,
            phoneNumber: user.contactNumber,
            email: user.email,
        };
        const profileInfo = {
            height: user.height || 0,
            gender: user.gender || "-",
            location: user.location || "-",
            hometown: user.homeTown || "-",
            languages: lang,
            starSign: user.starSign || "-",
            pronouns: user.pronouns || "-",
            sexualOrientation: user.sexualOrientation || "-",
            exercise: user.exercising || "-",
            drinking: user.drinking || "-",
            smoking: user.smoking || "-",
            family: user.kids || "-",
            politics: user.politicalViews || "-",
            religion: user.religion || "-",
            educationDetails: {
                instituteName: user.education?.instituteName || "-",
                graduationYear: user.education?.year || "-",
            },
            professionalDetails: {
                companyName: user.profession?.companyName || "-",
                role: user.profession?.jobTitle || "-",
            },
            images: user.image,
        };
        res.status(200).json({
            _id: user._id,
            info,
            userProfile,
            profileInfo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const userMatches = async (req, res) => {
    const { userId } = req.query;
    try {
        const swipe = await Swipe.findOne({ uid: userId }).select("match");

        if (swipe) {
            const reverseMatchArray = [...swipe.match].reverse();
            const matches = reverseMatchArray.map(async (secondUserId) => {
                const room = await Room.findOne({
                    $and: [
                        {
                            $or: [
                                { "firstUser.userId": userId },
                                { "firstUser.userId": secondUserId },
                            ],
                        },
                        {
                            $or: [
                                { "secondUser.userId": userId },
                                { "secondUser.userId": secondUserId },
                            ],
                        },
                    ],
                }).populate({
                    path: "offer",
                    select: "-createdAt -updatedAt",
                    populate: [
                        { path: "owner", model: "User" },
                        { path: "guest", model: "User" },
                        { path: "outlet", model: "Outlet" },
                        {
                            path: "orderDetails.forMe.item",
                            model: "OutletMenu",
                        },
                        {
                            path: "orderDetails.forYou.item",
                            model: "OutletMenu",
                        },
                    ],
                });
                const data = {
                    date: room.createdAt.getDate(),
                };
                const user = await User.findById(secondUserId);

                let date, time;
                let dateObject = new Date(ele.time);
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                data.matchName = user.name;
                data.gender = user.gender;
                data.offerStatus = "Pending";
                data.offerItem = "-";
                data.cafe = "-";
                data.offerTime = "-";
                data.offerDate = "-";
                if (room.offer) {
                    data.offerStatus =
                        room.offer.owner._id === userId ? "Sent" : "Received";
                    data.offerItem = ele.orderDetails?.forYou?.item?.name
                        ? ele.orderDetails.forYou.item.name
                        : "-";
                    data.cafe = room.offer.outlet?.name || "-";
                    data.offerTime = time;
                    data.offerDate = date;
                }
                return data;
            });
            res.status(200).json({ matches });
        } else {
            res.status(200).json({ matches: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const userMeetups = async (req, res) => {
    const { page = 1, userId } = req.query;
    const pageSize = 20;

    try {
        const offers = await Offer.find({
            $or: [{ owner: userId }, { guest: userId }],
        })
            .sort({ createdAt: -1 }) // Sorting in descending order
            .select(
                "owner time status outlet orderDetails.forYou.item bill.total"
            )
            .populate("owner", "name")
            .populate("outlet", "name city address")
            .populate("orderDetails.forYou.item", "name")
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        //! need to add status query in find, the update the data to set response

        //  console.log(offers);
        const meetups = await Promise.all(
            offers.map(async (ele) => {
                let date, time;

                if (!(ele.time === "Invalid Date" || !ele.time)) {
                    console.log(ele.time);

                    let dateObject = new Date(ele.time);
                    date = dateObject.toISOString().split("T")[0];
                    let hours = dateObject.getUTCHours();
                    let minutes = dateObject.getUTCMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    time = hours + ":" + minutes + " " + ampm;
                }

                const couponobj = await Coupon.findOne({
                    offer: ele._id,
                }).select("status");

                const couponStatus = couponobj ? couponobj.status : "-";

                const data = {
                    date,
                    time,
                    partner: ele.owner?.name,
                    partnerId:ele.owner?._id,
                    offerItem: ele.orderDetails.forYou?.item?.name,
                    cafe: ele.outlet?.name,
                    address: ele.outlet?.address,
                    offerStatus: ele.status,
                    couponStatus,
                };
                return data;
            })
        );
        res.status(200).json({ meetups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const bookingHistory = async (req, res) => {
    const { page = 1, date, cafeId, status,startDate,endDate } = req.query;
    const pageSize = 20;
    try {
        const cancelStatus = ["expired", "refunded"];
        const completedStatus = ["consumed"];
        const inProgressStatus = ["active", "shared"];
        const pendingStatus = ["floating", "archived", "actionNeed"];
        let query = { status: { $nin: ["paymentPending"] } };

        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                

                query.time= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.time= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }


        // if (date) {
        //     const dateSearch = formatDate(date);
        //     query.time = { $regex: dateSearch, $options: "i" };
        // }
        if (cafeId) {
            query.outlet = cafeId;
        }
        if (status) {
            const statusMap = {
                cancelled: cancelStatus,
                completed: completedStatus,
                inprogress: inProgressStatus,
                pending: pendingStatus,
            };

            query.status = {
                $in: statusMap[status],
            };
        }
        console.log(query);
        const bookings = await Offer.find(query)
            .sort({ createdAt: -1 }) // Sorting in descending order
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select(
                "owner time status outlet orderDetails.forYou.item bill.total"
            )
            .populate("owner", "name")
            .populate("outlet", "name city address")
            .populate("orderDetails.forYou.item", "name");

        const responseData = bookings.map((ele) => {
            let date, time;
            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);
                let dateObject = new Date(ele.time);

                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                let status;
                if (cancelStatus.includes(ele.status)) {
                    status = "cancelled";
                } else if (completedStatus.includes(ele.status)) {
                    status = "completed";
                } else if (inProgressStatus.includes(ele.status)) {
                    status = "inprogress";
                } else if (pendingStatus.includes(ele.status)) {
                    status = "pending";
                }

                const data = {
                    _id: ele._id,
                    date,
                    time,
                    hostName: ele.owner?.name ? ele.owner.name : "-",
                    name: ele.outlet?.name ? ele.outlet.name : "-",
                    order: ele.orderDetails?.forYou?.item?.name
                        ? ele.orderDetails.forYou.item.name
                        : "-",
                    address: ele.outlet?.address ? ele.outlet.address : "-",
                    city: ele.outlet?.city ? ele.outlet.city : "-",
                    purchaseOf: ele.bill?.total
                        ? parseFloat(ele.bill?.total).toFixed(2)
                        : 0,
                    orderStatus: status,
                };

                return data;
            }
        });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        console.log(startOfWeek);
        const todaysBooking = await Offer.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
        });

        const thisWeekBooking = await Offer.countDocuments({
            createdAt: {
                $gte: startOfWeek,
            },
        });
        res.status(200).json({
            bookings: responseData,
            todaysBooking,
            thisWeekBooking,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getOutlets = async (req, res) => {
    try {
        const outlets = await Outlet.find({}).select("name");
        res.status(200).json({ outlets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const weeklyReservation = async (req, res) => {
    const { date, state,startDate, endDate } = req.query;
    try {
        let dateObject = {};
        let query = {};

        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }



        // if (date) {
        //     const startOfWeek = new Date(date);
        //     startOfWeek.setHours(0, 0, 0, 0);
        //     const endOfWeek = new Date(date);
        //     endOfWeek.setHours(23, 59, 59, 999);
        //     query = {
        //         createdAt: {
        //             $gte: startOfWeek,
        //             $lte: endOfWeek,
        //         },
        //     };
        //     dateObject[date] = 0;
        // } else {
        //     const startOfWeek = new Date();
        //     startOfWeek.setHours(0, 0, 0, 0);
        //     startOfWeek.setDate(startOfWeek.getDate() - 7);

        //     const endOfWeek = new Date();
        //     endOfWeek.setHours(23, 59, 59, 999);
        //     for (
        //         let day = new Date(startOfWeek);
        //         day <= endOfWeek;
        //         day.setDate(day.getDate() + 1)
        //     ) {
        //         let formattedDate = `${day.getFullYear()}-${(
        //             "0" +
        //             (day.getMonth() + 1)
        //         ).slice(-2)}-${("0" + day.getDate()).slice(-2)}`;
        //         dateObject[formattedDate] = 0;
        //     }
        //     console.log(dateObject);
        //     query = {
        //         createdAt: {
        //             $gte: startOfWeek,
        //             $lte: endOfWeek,
        //         },
        //     };
        // }
        console.log(query);
        const offer = await Offer.find(query)
            .sort({ createdAt: -1 })
            .populate("outlet", "city")
            .select("outlet createdAt");
        let response = {};
        offer.map((ele) => {
            const newDate = ele.createdAt.toISOString().split("T")[0];
            if (!response[ele.outlet?.city ? ele.outlet.city : "-"]) {
                response[ele.outlet?.city ? ele.outlet.city : "-"] = dateObject;
            }
            response[ele.outlet?.city ? ele.outlet.city : "-"][newDate]++;
        });

        res.status(200).json({ weeklyBooking: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const userTraffic = async (req, res) => {
    const { search = "" } = req.query;
    try {
        const userTraffic = await User.aggregate([
            {
                $addFields: {
                    townArray: { $split: ["$location", ","] },
                },
            },
            {
                $addFields: {
                    town: { $arrayElemAt: ["$townArray", -3] },
                },
            },
            {
                $addFields: {
                    town: { $trim: { input: "$town" } },
                },
            },
            {
                $match: {
                    town: { $regex: new RegExp(search, "i") }, // case-insensitive search
                },
            },
            {
                $group: {
                    _id: "$town",
                    count: { $sum: 1 },
                    female: { $sum: { $cond: [{ $eq: ["$gender", "Female"] }, 1, 0] } },
                    male: { $sum: { $cond: [{ $eq: ["$gender", "Male"] }, 1, 0] } }

                },
            },
            {
                $sort: { count: -1 } // Sort by the 'count' field in descending order
            }
        ]);

        
        res.status(200).json({ userTraffic });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const purchase = async (req, res) => {
    const { page = 1, date, time, cafeId, city, status, search,startDate, endDate } = req.query;
    const pageSize = 20;
    try {
        const cancelStatus = ["expired", "refunded"];
        const completedStatus = ["consumed"];
        const inProgressStatus = ["active", "shared"];
        const pendingStatus = ["floating", "archived", "actionNeed"];
        let query = { status: { $nin: ["paymentPending"] } };


        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }



        if (date && time) {
            const dateSearch = formatDate(date);
            const newTime = convertTo24Hour(time);
            const finalString = dateSearch + " " + newTime;
            query.time = { $regex: finalString, $options: "i" };
        } else {
            if (date) {
                const dateSearch = formatDate(date);
                query.time = { $regex: dateSearch, $options: "i" };
            }
            if (time) {
                const newTime = convertTo24Hour(time);
                query.time = { $regex: newTime, $options: "i" };
            }
        }
        if (cafeId) {
            query.outlet = cafeId;
        }
        if (status) {
            const statusMap = {
                cancelled: cancelStatus,
                completed: completedStatus,
                inprogress: inProgressStatus,
                pending: pendingStatus,
            };

            query.status = {
                $in: statusMap[status],
            };
        }
        if (city) {
            const outlets = await Outlet.find({
                city: { $regex: city, $options: "i" },
            }).select("_id name");
            const outletIds = outlets.map((outlet) => outlet._id);
            query.outlet = { $in: outletIds };
        }
        if (search) {
            //one way is to apply reges to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search
            const users = await User.find({
                $or: [
                    { name: regex },
                    { contactNumber: regex },
                    { email: regex },
                ],
            }).select("_id");
            const guestUsers = await User.find({ name: regex }).select("_id");
            const outlets = await Outlet.find({
                $or: [{ name: regex }, { city: regex }],
            }).select("_id");
            const outletIds = outlets.map((outlet) => outlet._id);
            const userIds = users.map((user) => user._id);
            const guestUsersIds = guestUsers.map((user) => user._id);
            query.$or = [
                { owner: { $in: userIds } },
                { guest: { $in: guestUsersIds } },
                { outlet: { $in: outletIds } },
            ];
        }
        console.log(query);
        const bookings = await Offer.find(query)
            .sort({ createdAt: -1 }) // Sorting in descending order
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select(
                "owner guest time status outlet orderDetails.forYou.item bill.total"
            )
            .populate("owner", "name location contactNumber email image")
            .populate("guest", "name")
            .populate("outlet", "name city address")
            .populate("orderDetails.forYou.item", "name");

        const responseData = bookings.map((ele) => {
            if (!(ele.time === "Invalid Date" || !ele.time)) {
                let date, time;
                console.log(ele.time);
                let dateObject = new Date(ele.time);

                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                let status;
                if (cancelStatus.includes(ele.status)) {
                    status = "cancelled";
                } else if (completedStatus.includes(ele.status)) {
                    status = "completed";
                } else if (inProgressStatus.includes(ele.status)) {
                    status = "inprogress";
                } else if (pendingStatus.includes(ele.status)) {
                    status = "pending";
                }

                const data = {
                    _id: ele._id,
                    userName: ele.owner?.name ? ele.owner.name : "-",
                    userImage: ele.owner?.image[0],
                    userNumber: ele.owner?.contactNumber
                        ? ele.owner.contactNumber
                        : "-",
                    userEmail: ele.owner?.email ? ele.owner.email : "-",
                    guestName: ele.guest?.name ? ele.guest.name : "-",
                    date,
                    time,
                    restaurantName: ele.outlet?.name ? ele.outlet.name : "-",
                    city: ele.outlet?.city ? ele.outlet.city : "-",
                    order: ele.orderDetails?.forYou?.item?.name
                        ? ele.orderDetails.forYou.item.name
                        : "-",
                    orderStatus: status,
                };

                return data;
            }
        });
        res.status(200).json({
            purchase: responseData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getCafeCity = async (req, res) => {
    try {
        const outlets = await Outlet.distinct("city");
        res.status(200).json({ city: outlets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// meetup history
const meetupshistory = async (req, res) => {
    const {
        page = 1,
        offering,
        date,
        time,
        cafeId,
        status,
        search,
        startDate,
        endDate,
        lowerlimit,
        upperlimit,
    } = req.query;
    const pageSize = 20;
    try {
        const cancelStatus = ["expired", "refunded"];
        const completedStatus = ["consumed"];
        const inProgressStatus = ["active", "shared"];
        const pendingStatus = ["floating", "archived", "actionNeed"];

        let query = {
            status: { $in: ["active", "shared", "consumed", "expired"] },
        };



        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";


                query.time= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.time= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }



        //filter for cafe
        if (cafeId) {
            query.outlet = cafeId;
        }
        //filter for status
        if (status) {
            const statusMap = {
                cancelled: cancelStatus,
                completed: completedStatus,
                inprogress: inProgressStatus,
                pending: pendingStatus,
            };

            query.status = {
                $in: statusMap[status],
            };
        }

        //filter for offering
        if (offering) {
            query.offering = offering;
        }

        //filter for search
        if (search) {
            //one way is to apply regex to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search

            const users = await User.find({
                $or: [
                    { name: regex },
                    { contactNumber: regex },
                    { email: regex },
                ],
            }).select("_id");
            const guestUsers = await User.find({ name: regex }).select("_id");
            const outlets = await Outlet.find({
                $or: [{ name: regex }, { city: regex }],
            }).select("_id");

            const outletIds = outlets.map((outlet) => outlet._id);
            const userIds = users.map((user) => user._id);
            const guestUsersIds = guestUsers.map((user) => user._id);

            query.$or = [
                { owner: { $in: userIds } },
                { guest: { $in: guestUsersIds } },
                { outlet: { $in: outletIds } },
            ];
        }

        //filter for transaction
        if (lowerlimit && upperlimit) {
            query.$and = [
                { "bill.total": { $gte: lowerlimit } },
                { "bill.total": { $lte: upperlimit } },
            ];
        }
        console.log(query);
        const meetups = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("owner")
            .populate("outlet", "name city address")
            .populate("orderDetails.forYou.item", "name");

        const responseData = meetups.map((ele) => {
            let date, time;

            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);
                let dateObject = new Date(ele.time);

                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                let status;
                if (cancelStatus.includes(ele.status)) {
                    status = "cancelled";
                } else if (completedStatus.includes(ele.status)) {
                    status = "completed";
                } else if (inProgressStatus.includes(ele.status)) {
                    status = "inprogress";
                } else if (pendingStatus.includes(ele.status)) {
                    status = "pending";
                }

                const data = {
                    _id: ele._id,
                    date,
                    time,
                    hostName: ele.owner?.name ? ele.owner.name : "-",
                    hostImage:"https://picsum.photos/200/300",
                    guestName: ele.guest?.name ? ele.guest.name : "-",
                    name: ele.outlet?.name ? ele.outlet.name : "-",
                    order: ele.orderDetails?.forYou?.item?.name
                        ? ele.orderDetails.forYou.item.name
                        : "-",
                    address: ele.outlet?.address ? ele.outlet.address : "-",
                    city: ele.outlet?.city ? ele.outlet.city : "-",
                    purchaseOf: ele.bill?.total
                        ? parseFloat(ele.bill?.total).toFixed(2)
                        : 0,
                    orderStatus: status,
                };

                return data;
            }
        });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        //getting todayMeetups data
        const todaysMeetups = await Offer.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
            status: { $in: ["active", "consumed", "floating", "shared"] },
        });

        //getting new sechedule today
        const newSechedule = await Offer.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
            status: {
                $in: ["active", "consumed", "floating", "shared", "archived"],
            },
        });

        // getting total partner
        const totalPartner = await Outlet.countDocuments();

        // getting new partner
        const newPartner = await Outlet.countDocuments({
            createdAt: {
                $gte: startOfToday,
            },
        });
        res.status(200).json({
            meetups: responseData,
            todaysMeetups,
            newSechedule,
            totalPartner,
            newPartner,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const userProfiles = async (req, res) => {
    const { dateTo, dateFrom, city, meetups, page = 1, search } = req.query;
    const pageSize = 20;
    try {
        const query = {};

        const users = await User.find(query)
            .sort({ createdAt: -1 }) // Sorting in descending order
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select(
                "name email contactNumber dob location deleted image completed"
            );

        const response = await Promise.all(
            users.map(async (ele) => {
                const meetupCount = await Offer.countDocuments({
                    status: { $in: ["active", "shared", "consumed"] },
                    $or: [{ owner: ele._id }, { guest: ele._id }],
                });
                let city = "-";
                if (ele.completed) {
                    const locationParts = ele.location.split(","); // Split the location string into parts
                    const cityIndex = locationParts.length - 3; // Get the index of the city
                    city = locationParts[cityIndex].trim();
                }
                const data = {
                    _id: ele._id,
                    userImage: "https://picsum.photos/200/300",
                    userName: ele.name || "-",
                    userNumber: ele.contactNumber || "-",
                    userEmail: ele.email || "-",
                    dob: ele.dob || "-",
                    city,
                    meetup: meetupCount,
                    status: ele.deleted === true ? "Deactive" : "Active",
                };
                return data;
            })
        );

        res.status(200).json({ users: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getUserCity = async (req, res) => {
    try {
        const userTraffic = await User.aggregate([
            {
                $addFields: {
                    townArray: { $split: ["$location", ","] },
                },
            },
            {
                $addFields: {
                    town: { $arrayElemAt: ["$townArray", -3] },
                },
            },
            {
                $addFields: {
                    town: { $trim: { input: "$town" } },
                },
            },
            {
                $group: {
                    _id: "$town",
                    count: { $sum: 1 },
                },
            },
        ]);
        const response = [];
        userTraffic.map((ele) => {
            response.push(ele._id);
        });
        res.status(200).json({ city: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//cityDetails
const cityDetails = async (req, res) => {
    const { page = 1,search } = req.query;
    const pageSize = 20;
    try {

        let query={$match: {} };

        if(search){
            query={
                $match:{
                    city:{$regex:search,$options:"i"}
                }
            }
        }

        const outletDetails = await Outlet.aggregate([
            
           query,
            {
                $group: {
                    _id: "$city",
                    outletCount: { $sum: 1 }, // Count the number of outlets in each city
                },
            }
        ])
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        //console.log(outletDetails)

        const result = await Promise.all(
            outletDetails.map(async (city) => {
                const bookingsCount = await Offer.countDocuments({
                    outlet: {
                        $in: await Outlet.find({ city: city._id }).distinct(
                            "_id"
                        ),
                    },
                });
                return {
                    city: city._id,
                    outletCount: city.outletCount,
                    bookingsCount,
                };
            })
        );
        // Total Bookings
        const totalBooking = await Offer.countDocuments();
        // Total outlets
        const totalOutlet = await Outlet.countDocuments();

        res.status(200).json({
            cityDetials: result,
            totalBooking,
            totalOutlet,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//partner_data
const partnerData = async (req, res) => {
    const { page = 1, city, search } = req.query;
    const pageSize = 20;
    try {
        const query = {};

        //filter for search

        if (search) {
            //one way is to apply regex to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search

            const outlets = await Outlet.find({
                $or: [
                    { name: {$regex:search,$options:"i"} },
                    { city: {$regex:search,$options:"i"} },
                    { "info.address": regex },
                ],
            }).select("_id");

            const outletIds = outlets.map((outlet) => outlet._id);
            
            query.$or = [{ _id: { $in: outletIds } }];
        }

        // filter for city
        if (city) {
            query.city = city;
        }

        const outletdetails = await Outlet.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select(
                "name address city managerName account openAt closeAt managerContact email menuTitle info"
            );

        const result = await Promise.all(
            outletdetails.map(async (store) => {
                const bookingsCount = await Offer.countDocuments({
                    outlet: store._id,
                });

                // function change time
                
                function changeTime(time){
                    let timeArray=time.split(":");
                    let hr=timeArray[0];
                    let min=timeArray[1];
                    
                    let ampm=hr>=12?"pm":"am";
                    
                    hr=hr%12;

                    if(hr==0){
                        hr=12
                    }
                    
                    let newTime=`${hr}:${min}:${ampm}`;
                    
                    return newTime;
                    
                }

                
                let openAt=store.openAt? changeTime(store.openAt):"";
                let closeAt=store.closeAt? changeTime(store.closeAt):"";

                // const outletMenu= await OutletMenu.find({outletId:store._id})
                //                     .select("name image price bio")

                return {
                    id: store._id,
                    name: store.name,
                    address: store.address,
                    city: store.city,
                    managerName: store.managerName,
                    managerContect:store.managerContact,
                    openAt,
                    closeAt,
                    email: store.email,
                    status: store.info.timing.status,
                    bookingsCount,
                    accountDetails:{
                        accountHolderName:store.account?.accName,
                        bankName:store.account?.bankName,
                        accountNumber:store.account?.accNo
                    },
                    restaurantImage:store.info.image

                };
            })
        );
        //console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const partnerDataById=async(req,res)=>{

    const {partnerId}=req.query
    try {

        const store = await Outlet.findOne({_id:partnerId})
            .select(
                "name address city managerName category account openAt closeAt managerContact email menuTitle info"
            );
            
             // function change time
                    
             function changeTime(time){
                let timeArray=time.split(":");
                let hr=timeArray[0];
                let min=timeArray[1];
                
                let ampm=hr>=12?"pm":"am";
                
                hr=hr%12;

                if(hr==0){
                    hr=12
                }
                
                let newTime=`${hr}:${min}:${ampm}`;
                
                return newTime;
                
            }

            
            let openAt=store.openAt? changeTime(store.openAt):"";
            let closeAt=store.closeAt? changeTime(store.closeAt):"";

            // const outletMenu= await OutletMenu.find({outletId:store._id})
            //                     .select("name image price bio")

            let responseData= {
                id: store._id,
                name: store.name,
                address: store.address,
                city: store.city,
                managerName: store.managerName,
                managerContect:store.managerContact,
                openAt,
                closeAt,
                email: store.email,
                status: store.info?.timing?.status,
                category: store.category,
                accountDetails:{
                    accountHolderName:store.account?.accName,
                    bankName:store.account?.bankName,
                    accountNumber:store.account?.accNo
                },
                restaurantImage:store?.info?.image

            };
                   
                
            
            //console.log(result);
            res.status(200).json({ responseData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Something went wrong" });
        }   

}


// partnerMenuItems

const partnerMenuItems=async(req,res)=>{

    const {page=1,restaurantId,nonVeg}=req.query;
    const pageSize=20;

    try {

        let query={outletId:restaurantId};

        if(nonVeg){
            query.nonVeg=nonVeg;
        }

        console.log("query......",query)

        const restaurantMenu=await OutletMenu.find(query)
                                    .sort({createdAt:-1})
                                    .skip((page - 1) * pageSize)
                                    .limit(pageSize)
                                    .select("name image price status bio nonVeg earlyBird menuTitleTags")

        
        
        const responseData=await Promise.all(restaurantMenu.map(async(ele)=>{

            /*
            . name
            image
            desc
            price
            vag/
            cat=>starter,maincourse

            */
            

            const data={
                itemId:ele._id,
                itemImage:ele.image[0],
                itemName:ele.name,
                itemPrice:ele.price,
                itemStatus:ele.status,
                itemNonveg:ele.nonVeg,
                itemDescription:ele.bio,
                earlyBird:ele.earlyBird,
                menuTitleTags:ele.menuTitleTags
            }

            return data
        }))

        let restaurantName = await Outlet.findOne({_id:restaurantId})
                                .select("name");
       // restaurantName=restaurantName.name;
        
                                    
        res.status(200).json({responseData,restaurantName})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// offerCreation

const offerCreation = async (req, res) => {
    const {
        page = 1,
        offering,
        date,
        time,
        cafeId,
        status,
        search,
        lowerlimit,
        upperlimit,
        startDate,
        endDate
    } = req.query;
    const pageSize = 20;

    try {
        let query = {};


         //filter for date

         if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }


        //filter for cafe
        if (cafeId) {
            query.outlet = cafeId;
        }

        //filter for offering
        if (offering) {
            query.offering = offering;
        }

        //filter for search
        if (search) {
            //one way is to apply regex to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search

            const users = await User.find({
                $or: [
                    { name: regex },
                    { contactNumber: regex },
                    { email: regex },
                ],
            }).select("_id");
            const guestUsers = await User.find({ name: regex }).select("_id");
            const outlets = await Outlet.find({
                $or: [{ name: regex }, { city: regex }],
            }).select("_id");

            const outletIds = outlets.map((outlet) => outlet._id);
            const userIds = users.map((user) => user._id);
            const guestUsersIds = guestUsers.map((user) => user._id);

            query.$or = [
                { owner: { $in: userIds } },
                { guest: { $in: guestUsersIds } },
                { outlet: { $in: outletIds } },
            ];
        }

        //filter for transaction
        if (lowerlimit && upperlimit) {
            query.$and = [
                { "bill.total": { $gte: lowerlimit } },
                { "bill.total": { $lte: upperlimit } },
            ];
        }

        console.log("..........query",query);

        const offercr = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("owner", "name")
            .populate("outlet", "name city address")
            .select("time offering bill.total responseCount");

        const responseData = offercr.map((ele) => {
            let date, time, leftTime;

            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);

                let dateObject = new Date(ele.time);
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                // Calculating the difference between the provided time and the current time in minutes
                let currentTime = new Date();
                let timeDifference = currentTime-dateObject;
                let secondDifference = Math.floor(
                    timeDifference / 1000
                ); // Convert milliseconds to second


                // Set the time format based on the difference
                if (secondDifference < 60) {
                    leftTime = secondDifference + " sec";
                } else if (secondDifference < 3600) {
                    let timeInMinutes = Math.floor(secondDifference / 60);
                    let timeInSecond = secondDifference % 60;
                    leftTime = timeInMinutes + " min " + timeInSecond + " sec";
                } else {
                    let timeInHours = Math.floor(secondDifference / 3600);
                    let leftSecondForMin = secondDifference % 3600;
                    let timeInMinutes = Math.floor(leftSecondForMin / 60);
                    let timeInSecond = leftSecondForMin % 60;

                    if (timeInHours >= 24) {
                        let days = Math.floor(timeInHours / 24);
                        timeInHours %= 24;
                        leftTime = days + " days " + timeInHours + " hr " + timeInMinutes + " min " + timeInSecond + " sec";
                    } else {
                        leftTime = timeInHours + " hr " + timeInMinutes + " min " + timeInSecond + " sec";
                    }
                    
                }               
                
            }

            const data = {
                id: ele.owner?._id,
                date,
                time,
                leftTime,
                hostName: ele.owner?.name ? ele.owner.name : "-",
                hostImage: "https://picsum.photos/200/300",
                offer: ele.offering,
                address: ele.outlet?.address ? ele.outlet.address : "-",
                city: ele.outlet?.city ? ele.outlet.city : "-",
                purchaseOf: ele.bill?.total
                    ? parseFloat(ele.bill?.total).toFixed(2)
                    : 0,
                offerReached: ele.responseCount,
            };

            return data;
        });

        const offerCreated = await Offer.countDocuments();
        const offerMatched = await Offer.countDocuments({
            status: { $in: ["active", "shared", "consumed"] },
        });
        const offerExpire = await Offer.countDocuments({ status: "expired" });

        res.status(200).json({
            offerCreation: responseData,
            offerCreated,
            offerMatched,
            offerExpire,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//matched
const matched = async (req, res) => {
    const {
        page = 1,
        offering,
        date,
        time,
        cafeId,
        status,
        search,
        lowerlimit,
        upperlimit,
        startDate,
        endDate
    } = req.query;
    const pageSize = 20;

    try {
        let query = { status: { $in: ["active", "shared", "consumed"] } };


         //filter for date

         if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }


        //filter for cafe
        if (cafeId) {
            query.outlet = cafeId;
        }

        //filter for offering
        if (offering) {
            query.offering = offering;
        }

        //filter for search
        if (search) {
            //one way is to apply regex to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search

            const users = await User.find({
                $or: [
                    { name: regex },
                    { contactNumber: regex },
                    { email: regex },
                ],
            }).select("_id");
            const guestUsers = await User.find({ name: regex }).select("_id");
            const outlets = await Outlet.find({
                $or: [{ name: regex }, { city: regex }],
            }).select("_id");

            const outletIds = outlets.map((outlet) => outlet._id);
            const userIds = users.map((user) => user._id);
            const guestUsersIds = guestUsers.map((user) => user._id);

            query.$or = [
                { owner: { $in: userIds } },
                { guest: { $in: guestUsersIds } },
                { outlet: { $in: outletIds } },
            ];
        }

        //filter for transaction
        if (lowerlimit && upperlimit) {
            query.$and = [
                { "bill.total": { $gte: lowerlimit } },
                { "bill.total": { $lte: upperlimit } },
            ];
        }

        console.log(query);

        const matchedarray = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("owner", "name")
            .populate("guest", "name")
            .populate("outlet", "name city address")
            .select("time offering bill.total responseCount");

        const responseData = matchedarray.map((ele) => {
            let date, time, leftTime;

            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);

                let dateObject = new Date(ele.time);
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;
            }

            const data = {
                id: ele.owner?._id,
                date,
                time,
                hostName: ele.owner?.name ? ele.owner.name : "-",
                hostImage: "https://picsum.photos/200/300",
                matchedName: ele.guest?.name ? ele.guest.name : "-",
                offer: ele.offering,
                address: ele.outlet?.address ? ele.outlet.address : "-",
                city: ele.outlet?.city ? ele.outlet.city : "-",
                purchaseOf: ele.bill?.total
                    ? parseFloat(ele.bill?.total).toFixed(2)
                    : 0,
            };

            return data;
        });

        const offerCreated = await Offer.countDocuments();
        const offerMatched = await Offer.countDocuments({
            status: { $in: ["active", "shared", "consumed"] },
        });
        const offerExpire = await Offer.countDocuments({ status: "expired" });

        res.status(200).json({
            matched: responseData,
            offerCreated,
            offerMatched,
            offerExpire,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//Offerexpired

const offerExpired = async (req, res) => {
    const {
        page = 1,
        offering,
        date,
        time,
        cafeId,
        status,
        search,
        lowerlimit,
        upperlimit,
        startDate,
        endDate
    } = req.query;
    const pageSize = 20;

    try {
        let query = { status: "expired" };

        
         //filter for date

         if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }

        //filter for cafe
        if (cafeId) {
            query.outlet = cafeId;
        }

        //filter for offering
        if (offering) {
            query.offering = offering;
        }

        //filter for search
        if (search) {
            //one way is to apply regex to separate query and the get the IDs to apply it in query
            const regex = new RegExp(search, "i"); // case insensitive search

            const users = await User.find({
                $or: [
                    { name: regex },
                    { contactNumber: regex },
                    { email: regex },
                ],
            }).select("_id");
            const guestUsers = await User.find({ name: regex }).select("_id");
            const outlets = await Outlet.find({
                $or: [{ name: regex }, { city: regex }],
            }).select("_id");

            const outletIds = outlets.map((outlet) => outlet._id);
            const userIds = users.map((user) => user._id);
            const guestUsersIds = guestUsers.map((user) => user._id);

            query.$or = [
                { owner: { $in: userIds } },
                { guest: { $in: guestUsersIds } },
                { outlet: { $in: outletIds } },
            ];
        }

        //filter for transaction
        if (lowerlimit && upperlimit) {
            query.$and = [
                { "bill.total": { $gte: lowerlimit } },
                { "bill.total": { $lte: upperlimit } },
            ];
        }

        console.log(query);

        const expiredoffers = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate("owner", "name")
            .populate("outlet", "name city address")
            .select("time offering bill.total responseCount");

        const responseData = expiredoffers.map((ele) => {
            let date, time;

            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);

                let dateObject = new Date(ele.time);
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;
            }

            const data = {
                id: ele.owner?._id,
                date,
                time,
                hostName: ele.owner?.name ? ele.owner.name : "-",
                hostImage: "https://picsum.photos/200/300",
                offer: ele.offering,
                address: ele.outlet?.address ? ele.outlet.address : "-",
                city: ele.outlet?.city ? ele.outlet.city : "-",
                purchaseOf: ele.bill?.total
                    ? parseFloat(ele.bill?.total).toFixed(2)
                    : 0,
            };

            return data;
        });

        const offerCreated = await Offer.countDocuments();
        const offerMatched = await Offer.countDocuments({
            status: { $in: ["active", "shared", "consumed"] },
        });
        const offerExpire = await Offer.countDocuments({ status: "expired" });

        res.status(200).json({
            matched: responseData,
            offerCreated,
            offerMatched,
            offerExpire,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// creditAmount for transition_History

const creditAmount = async (req, res) => {
    const {
        page = 1,
        offering,
        date,
        time,
        startDate,
        endDate,
        cafeId,
        status,
        lowerlimit,
        upperlimit,
        search
    } = req.query;
    const pageSize = 50;

    try {
        let query = { desc: "offer" };


        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.createdAt= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.createdAt= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }

        // filter for search

        if(search){
            let user= await User.find({
                $or:[
                    {name: {$regex:search, $options:"i"}},
                    {email:{$regex:search, $options:"i"}}
                ]
            });
            user=user.map(user=>user._id);
            query.userId={$in:user}
        }

        //filter for cafe

        if (cafeId) {
            let offers = await Offer.find({ outlet: cafeId }).select("_id");
            let offerIds = offers.map((el) => el._id);
            query.offerId = { $in: offerIds };
        }

        //filter for offering

        if (offering) {
            let offers = await Offer.find({ offering: offering }).select("_id");
            let offerIds = offers.map((el) => el._id);
            query.offerId = { $in: offerIds };
        }

        //filter for transaction
        if (lowerlimit && upperlimit) {
            query.$and = [
                { amount: { $gte: lowerlimit } },
                { amount: { $lte: upperlimit } },
            ];
        }

        //filter for status
        if (status) {
            query.status = status;
        }

        console.log(query);

        const ledgerdata = await Ledger.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        let responseData = await Promise.all(
            ledgerdata.map(async (ele) => {
                let date, time;

                if (!(ele.createdAt === "Invalid Date" || !ele.createdAt)) {
                    console.log(ele.createdAt);

                    let dateObject = new Date(ele.createdAt);
                    date = dateObject.toISOString().split("T")[0];
                    let hours = dateObject.getUTCHours();
                    let minutes = dateObject.getUTCMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    time = hours + ":" + minutes + " " + ampm;
                }

                const userone = await User.findOne({ _id: ele.userId }).select(
                    "name"
                );
                const offerone = await Offer.findOne({
                    _id: ele.offerId,
                })
                    .populate(
                        "outlet orderDetails.forYou.item orderDetails.forMe.item"
                    )
                    .select("outlet orderDetails bill");

                let orderforyou = offerone?.orderDetails?.forYou?.item?.name;
                let orderforme = offerone?.orderDetails?.forMe?.item?.name;

                let quantity = 0;
                let item = [];
                if (orderforyou) {
                    item.push(orderforyou);
                    quantity++;
                }
                if (orderforme) {
                    item.push(orderforme);
                    quantity++;
                }

                let tax = offerone?.bill?.tax;
                let sgst;
                let cgst;
                if (offerone?.bill?.platformCharge === 5) {
                    tax = tax - 0.9;
                    sgst = parseFloat(tax / 2).toFixed(2);
                    cgst = parseFloat(tax / 2).toFixed(2);
                } else if (offerone?.bill?.platformCharge === 0) {
                    sgst = parseFloat(tax / 2).toFixed(2);
                    cgst = parseFloat(tax / 2).toFixed(2);
                }

                let data = {
                    transactionID: ele.txnNumber,
                    name: userone?userone.name:"-",
                    userImage:"https://picsum.photos/200/300",

                    item,
                    restaurant: offerone?.outlet?.name,
                    date: date,
                    time: time,
                    invoiveNo: ele.txnNumber,
                    taxableValue: offerone?.bill?.itemTotal,
                    GST: "5%",
                    sgst:0.00,
                    cgst:0.00,
                    quantity,
                    amount: offerone?.bill.total,
                    platformfee: offerone?.bill?.platformCharge,
                    platformfeeGst: 0.9,
                    total: offerone?.bill.total,
                    status: ele.status,
                    //userID: userone._id,
                };

                return data;
            })
        );

        const totalTransaction = await Ledger.countDocuments();
        let totalTransactionInRuppee = await Ledger.aggregate([
            { $match: { desc: "offer" } },
            { $group: { _id: "offer", totalAmount: { $sum: "$amount" } } },
        ]);

        totalTransactionInRuppee = parseFloat(
            totalTransactionInRuppee[0].totalAmount
        ).toFixed(2);

        res.status(200).json({
            responseData,
            totalTransaction,
            totalTransactionInRuppee,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// get UserQuery

const userQuery = async (req, res) => {
    const { page = 1,city,status,startDate, endDate} = req.query;
    const pageSize = 20;

    try {
        let query={}

         //filter for date

         if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.createdAt= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.createdAt= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }




        if(city){

            let cityUsers=await User.find({location:{$regex:city, $options:"i"}})
            cityUsers=cityUsers.map(user => user._id);
            query.user={$in:cityUsers}
        }

        if(status){
            query.status=status
        }

        const allquery = await Userquery.find(query)
            .populate("user", "name email location image")
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        const responseData = await Promise.all(
            allquery.map((ele) => {
                let date, time;

                if (!(ele.createdAt === "Invalid Date" || !ele.createdAt)) {
                    console.log(ele.createdAt);

                    let dateObject = new Date(ele.createdAt);
                    date = dateObject.toISOString().split("T")[0];
                    let hours = dateObject.getUTCHours();
                    let minutes = dateObject.getUTCMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    time = hours + ":" + minutes + " " + ampm;
                }


                const locationParts=ele.user.location.split(",") 
                const cityIndex=locationParts.length-3;
                const city=locationParts[cityIndex];

                let data = {
                    id: ele._id,
                    date,
                    time,
                    name: ele.user.name,
                    email:ele.user.email,
                    userImage: "https://picsum.photos/200/300",
                    city,
                    query: ele.title,
                    description:ele.description,
                    resolution:ele.resolution?ele.resolution:"-",
                    status: ele.status,
                    queryImage: ele.image,
                };

                return data;
            })
        );

        res.status(200).json({ responseData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// add resolution to query

const addResolutionquery = async (req, res) => {
    const { queryid, resolution } = req.body;

    try {
        let query = await Userquery.findOne({ _id: queryid });
        if (query) {
            const data = await Userquery.findByIdAndUpdate(
                { _id: queryid },
                { resolution, status: "Resolved" },
                { new: true }
            );
            const user = await User.findById(data.user).select("deviceId");
            await sendPushNotification(
                user?.deviceId,
                "Your query has been resolved",
                "For more details go to: contact us -> view your queries"
            );
            res.status(200).json({ message: "add resolution successfully" });
        } else {
            res.status(400).json({ message: "query not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//api for post UserQuery only for developer

// const addUserQuery=async(req,res)=>{

//     const {User,status,title,description}=req.body;

//     try {
//         const query= new Userquery({User,status,title,description});
//         await query.save();
//         res.status(200).json({message:"query saved",query});

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// }

// userDeals

const userDeals = async (req, res) => {
    const { userId } = req.query;
    try {
        let queryforfloting = { owner: userId, status: "floating" };
        const floating = await Offer.find(queryforfloting)
            .populate("outlet orderDetails.forYou.item orderDetails.forMe.item")
            .select("orderDetails createdAt time outlet bill");

        const floatingdeals = await Promise.all(
            floating.map(async (ele) => {
                let date, time;

                if (!(ele.time === "Invalid Date" || !ele.time)) {
                    console.log(ele.time);

                    let dateObject = new Date(ele.time);
                    date = dateObject.toISOString().split("T")[0];
                    let hours = dateObject.getUTCHours();
                    let minutes = dateObject.getUTCMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    time = hours + ":" + minutes + " " + ampm;
                }

                let order = [];

                let orderforyou ={
                    item:ele.orderDetails?.forYou?.item?.name,
                    price:ele.orderDetails?.forYou?.item?.price
                } ;
                

                let orderforme = {
                    item:ele.orderDetails?.forMe?.item?.name,
                    price:ele.orderDetails?.forMe?.item?.price
                }

                if (orderforyou) {
                    order.push(orderforyou);
                }
                if (orderforme) {
                    order.push(orderforme);
                }

                let data = {
                    date,
                    time,
                    outletName: ele.outlet.name,
                    outletaddress: ele.outlet.address,
                    order,
                    total: parseFloat(ele.bill.total).toFixed(2),
                };

                return data;
            })
        );

        let queryforupcoming = {
            owner: userId,
            status: { $in: ["shared", "active", "archived"] },
        };
        const upcoming = await Offer.find(queryforupcoming)
            .populate("outlet orderDetails.forYou.item orderDetails.forMe.item")
            .select("orderDetails createdAt time outlet bill");

        const upcomingdeals = await Promise.all(
            upcoming.map(async (ele) => {
                let date, time;

                if (!(ele.time === "Invalid Date" || !ele.time)) {
                    console.log(ele.time);

                    let dateObject = new Date(ele.time);
                    date = dateObject.toISOString().split("T")[0];
                    let hours = dateObject.getUTCHours();
                    let minutes = dateObject.getUTCMinutes();
                    let ampm = hours >= 12 ? "PM" : "AM";

                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? "0" + minutes : minutes;
                    time = hours + ":" + minutes + " " + ampm;
                }

                let order = [];

                let orderforyou ={
                    item:ele.orderDetails?.forYou?.item?.name,
                    price:ele.orderDetails?.forYou?.item?.price
                } ;
                

                let orderforme = {
                    item:ele.orderDetails?.forMe?.item?.name,
                    price:ele.orderDetails?.forMe?.item?.price
                }

                if (orderforyou) {
                    order.push(orderforyou);
                }
                if (orderforme) {
                    order.push(orderforme);
                }

                let data = {
                    date,
                    time,
                    outletName: ele.outlet.name,
                    outletaddress: ele.outlet.address,
                    order,
                    total: parseFloat(ele.bill.total).toFixed(2),
                };
                return data;
            })
        );

        res.status(200).json({ floatingdeals, upcomingdeals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Apis  for Users-Data

const usersDataMeetups=async(req,res)=>{

    let {page=1,orderStatus,city,restaurantId,search,startDate,endDate}=req.query;

    let pageSize=20;
    try {

        const cancelStatus = ["expired", "refunded"];
        const completedStatus = ["consumed"];
        const inProgressStatus = ["active", "shared"];
        const pendingStatus = ["floating", "archived", "actionNeed"];


        let query={};

        //filter for date

        if(startDate){

            if(startDate && endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                let endDateArray= endDate.split("/");
                let endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

                console.log(".........starrr",startDateString,endDateString)

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }else if(startDate && !endDate){
                let startDateArray= startDate.split("/");
                let startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
                
                let endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";

                query.timeDate= {
                    $gte: new Date(startDateString),
                    $lte: new Date(endDateString)
                  }
            }
        }




        if(search){

            let user= await User.find({
                $or:[
                    { name: {$regex:search, $options:"i"}},
                    { email:{$regex:search, $options:"i"}}
                ]
            })
            user=user.map(user=>user._id);
            query.owner={$in:user}
        }

        if(city){
           
            let cityUsers=await User.find({location:{$regex:city, $options:"i"}})
            cityUsers=cityUsers.map(user => user._id);
            query.owner={$in:cityUsers} 
        }

        if(restaurantId){

            query.outlet=restaurantId
        }

        if(orderStatus){
            if(orderStatus=="completed"){
                query.status={$in:completedStatus}
            }else if(orderStatus=="cancelled"){
                query.status={$in: cancelStatus}
            }else if(orderStatus=="inprogress"){
                query.status={$in: inProgressStatus}
            }else if(orderStatus=="pending"){
                query.status={$in: pendingStatus}
            }
        }
  

        const userOffers= await Offer.find(query)
                        .sort({createdAt: -1})
                        .skip((page-1) * pageSize)
                        .limit(pageSize)
                        .populate("owner","name email contactNumber location")
                        .populate("guest","name")
                        .populate("outlet", "name city address")
                        .select("owner time guest status outlet orderDetails createdAt");
        
        const responseData = await Promise.all(userOffers.map(async(ele)=>{
            let date, time, status;
            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);
                let dateObject = new Date(ele.time);

                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;

                if (cancelStatus.includes(ele.status)) {
                    status = "cancelled";
                } else if (completedStatus.includes(ele.status)) {
                    status = "completed";
                } else if (inProgressStatus.includes(ele.status)) {
                    status = "inprogress";
                } else if (pendingStatus.includes(ele.status)) {
                    status = "pending";
                }
            }

            const locationParts=ele.owner?.location?.split(",") 
            const cityIndex=locationParts?.length-3;
            const city=locationParts?locationParts[cityIndex]:"-";
            
            const data={
                orderId:ele._id,
                date,
                time,
                userName:ele.owner?.name,
                userImage: "https://picsum.photos/200/300",
                userNumber:ele.owner?.contactNumber,
                userEmail:ele.owner?.email,
                guestName:ele.guest?.name,
                restaurantName:ele.outlet?.name,
                city,
                orderStatus : status
            };

            return data;

        }))

        const verifiedUsers=await User.countDocuments({verified:true});
        const unVerifiedUsers=await User.countDocuments({verified:false});

        res.status(200).json({responseData,verifiedUsers,unVerifiedUsers});

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// api for verified users

const verifiedUsers=async(req,res)=>{

    let {page=1,search}=req.query;

    let pageSize=20;

    try {
        
        let query={verified:true};

        if(search){
           query={
            $or:[
                { name: {$regex:search, $options:"i"}},
                { email:{$regex:search, $options:"i"}}
            ]
           } 
        }

        const users=await User.find(query)
                    .sort({createdAt: -1})
                    .skip((page-1) * pageSize)
                    .limit(pageSize)

        const responseData = await Promise.all(users.map(async(ele)=>{

            
            const locationParts=ele.owner?.location?.split(",") 
            const cityIndex=locationParts?.length-3;
            const city=locationParts?locationParts[cityIndex]:"-";

            let data={
                userName : ele.name,
                userImage: "https://picsum.photos/200/300",
                userId:ele._id,
                userNumber : ele.contactNumber,
                userEmail : ele.email,
                dateOfBirth : ele.dob,
                city,
                verifiedStatus : ele.verified?"verified":"Un-verified"
            }
            return data;
        }))

        
        const verifiedUser=await User.countDocuments({verified:true});
        const unVerifiedUser=await User.countDocuments({verified:false});

        res.status(200).json({responseData,verifiedUser,unVerifiedUser});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}



// api for unVerified users

const unVerifiedUsers=async(req,res)=>{

    let {page=1,search}=req.query;

    let pageSize=20;

    try {
        
        let query={verified:false};

        if(search){
            query={
             $or:[
                 { name: {$regex:search, $options:"i"}},
                 { email:{$regex:search, $options:"i"}}
             ]
            } 
         }

        const users=await User.find(query)
                    .sort({createdAt: -1})
                    .skip((page-1) * pageSize)
                    .limit(pageSize)

        const responseData = await Promise.all(users.map(async(ele)=>{


            const locationParts=ele.owner?.location?.split(",") 
            const cityIndex=locationParts?.length-3;
            const city=locationParts?locationParts[cityIndex]:"-";

            let data={
                userName : ele.name,
                userImage: "https://picsum.photos/200/300",
                userId:ele._id,
                userNumber : ele.contactNumber,
                userEmail : ele.email,
                dateOfBirth : ele.dob,
                city,
                verifiedStatus : ele.verified?"verified":"Un-verified"
            }
            return data;
        }))

        
        const verifiedUser=await User.countDocuments({verified:true});
        const unVerifiedUser=await User.countDocuments({verified:false});

        res.status(200).json({responseData,verifiedUser,unVerifiedUser});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// api for refund Request
const refundRequest=async(req,res)=>{
    const {page=1,search}=req.query;
    const pageSize=20;
    try {
        
        let query={};

        if(search){
            let searchusers=await User.find({name:{$regex:search,$options:"i"}});
            searchusers=searchusers.map(user=>user._id);
            query.userId={$in:searchusers}
            
        }

        const refundUsers=await Refund.find(query)
                        .sort({createdAt: -1})
                        .skip((page-1)*pageSize)
                        .limit(pageSize)
                        .populate("userId","name")
                        .select("userId amount AccountNumber accountHolderName ifscCode status")
        
        const responseData=await Promise.all(refundUsers.map(async(ele)=>{

            let data={
                name:ele.userId?.name,
                amount:ele.amount,
                accountNumber:ele.AccountNumber,
                accountHolderName: ele.accountHolderName,
                ifscCode: ele.ifscCode,
                refundStatus:ele.status
            }

            return data;
        }));

        let refundedAmount=await Refund.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        refundedAmount=refundedAmount[0].totalAmount;

        let refundApproved= await Refund.countDocuments({status:"Refunded"});

        let refundDeclined= await Refund.countDocuments({status:"Declined"});

        res.status(200).json({responseData,refundedAmount,refundApproved,refundDeclined});


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// apies for claim offer

// selectRestaurants

const selectRestaurants=async(req,res)=>{

    const {page=1}=req.query;
    const pageSize=20;

    try {

        const restaurant=await Outlet.find()
                        .sort({createdAt:-1})
                        .skip((page-1) * pageSize)
                        .limit(pageSize)
                        .select("name info.timing earlyBird couponsLeft")
        const responseData=await Promise.all(restaurant.map(async(ele)=>{

            let openStatus=["open","closing soon"];
            let closeStatus=["closed","opening soon"];

            let restaurantStatus="";
            if(openStatus.includes(ele.info?.timing?.status)){
                    restaurantStatus="open"
            }else if(closeStatus.includes(ele.info?.timing?.status)){
                    restaurantStatus="close"
            }

            // const restaurantMenu=await OutletMenu.find({outletId:ele._id})
            //                         .select("name image price")

            const data={
                restaurantId:ele._id,
                restaurantName:ele.name,
                restaurantImage:ele.info?.image? ele.info?.image[0] :"https://picsum.photos/200/300",
                restaurantStatus,
                selectOfOffer:ele.earlyBird,
                numberOfOffer:ele.couponsLeft
                // restaurantMenu
            }
            return data
        }))
        res.status(200).json({responseData});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// menuItems

const menuItems=async(req,res)=>{

    const {restaurantId}=req.query;

    try {
        const restaurantMenu=await OutletMenu.find({outletId:restaurantId})
                                    .sort({createdAt:-1})
                                    .select("name image price status earlyBird")

        
        const responseData=await Promise.all(restaurantMenu.map(async(ele)=>{

            

            const data={
                itemId:ele._id,
                itemName:ele.name,
                itemPrice:ele.price,
                itemStatus:ele.status,
                itemSelectForOffer:ele.earlyBird,
                
            }

            return data
        }))

        let restaurantName = await Outlet.findOne({_id:restaurantId})
                                .select("name");
        restaurantName=restaurantName.name;
        
                                    
        res.status(200).json({responseData,restaurantName})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}




// claim offer submit

const claimOfferSubmit = async(req,res)=>{

    const{restaurantId,resSelectForOffer,resNumOffer,items}= req.body;

    try {

        const restaurant=await Outlet({_id:restaurantId});

        if(restaurant){
            let restaurantData=await Outlet.findByIdAndUpdate({_id:restaurantId},{earlyBird:resSelectForOffer,couponsLeft:resNumOffer});

            items.map(async(ele)=>{

                let updateItem=await OutletMenu.findByIdAndUpdate({_id:ele.id},{earlyBird:ele.itemSelectForOffer})

            });

            res.status(200).json({message:"Add successful"})

        }else{
            res.status(400).json({ message: "Restaurant not found" });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

// api for block user

const blockUser=async(req,res)=>{

    const {userId}=req.body;

    try {
        const userData=await User.findOne({_id:userId});

        if(!userData){
            const userBlock=await User.findByIdAndUpdate({_id:userId},{blocked:true});
            res.status(202).json({message:"User blocked successful"});
        }else{
            res.status(400).json({message:"User not found"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

//api for alert

const userAlert=async(req,res)=>{

    let {page=1,search}=req.query;
    const pageSize=20;
    
    let query={alert:true}

    if(search){
         //one way is to apply regex to separate query and the get the IDs to apply it in query
         const regex = new RegExp(search, "i"); // case insensitive search

         const users = await User.find({
             $or: [
                 { name: regex },
                 { contactNumber: regex },
                 { email: regex },
             ],
         }).select("_id");
         const guestUsers = await User.find({ name: regex }).select("_id");
         const outlets = await Outlet.find({
             $or: [{ name: regex }, { city: regex }],
         }).select("_id");

         const outletIds = outlets.map((outlet) => outlet._id);
         const userIds = users.map((user) => user._id);
         const guestUsersIds = guestUsers.map((user) => user._id);

         query.$or = [
             { owner: { $in: userIds } },
             { guest: { $in: guestUsersIds } },
             { outlet: { $in: outletIds } },
         ];
    }
    
    try {

        let alertOffers=await Arrival.find(query)
                        .sort({createdAt:-1})
                        .skip((page-1) * pageSize)
                        .limit(pageSize)
                        .populate({path:"offer",select: 'owner guest',populate:{path:"owner guest", select:'name image'}})
                        .populate("outlet","name info")
                        .select("offer outlet time alert alertReason alertResolution")


        let responseData= await Promise.all(alertOffers.map(async(ele)=>{

            let date, time;

            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);
                let dateObject = new Date(ele.time);

                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;
            }

            let alertStatus= ele.alertResolution?"resolved":"unresolved"

            const data={
                id: ele._id,
                date,
                time,
                hostName:ele.offer?.owner?.name,
                hostid:ele.offer?.owner?._id,
                hostImage:ele.offer?.owner?.image[0],
                guestName:ele.offer?.guest?.name,
                guestid:ele.offer?.guest?._id,
                guestImage:ele.offer?.guest?.image[0],
                restaurantName:ele.outlet?.name,
                restaurantAddress:ele.outlet?.address?ele.outlet?.address:"-",
                alertReason:ele.alertReason,
                alertStatus

            }

            return data

        }))

        res.status(200).json({responseData});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

// api for Report

const userReport=async(req,res)=>{

    let {page=1,search}=req.query;
    const pageSize=20;
    
    let query={}

    if(search){
         //one way is to apply regex to separate query and the get the IDs to apply it in query
         const regex = new RegExp(search, "i"); // case insensitive search

         const users = await User.find({
             $or: [
                 { name: regex },
                 { contactNumber: regex },
                 { email: regex },
             ],
         }).select("_id");
         const guestUsers = await User.find({ name: regex }).select("_id");
         const outlets = await Outlet.find({
             $or: [{ name: regex }, { city: regex }],
         }).select("_id");

         const outletIds = outlets.map((outlet) => outlet._id);
         const userIds = users.map((user) => user._id);
         const guestUsersIds = guestUsers.map((user) => user._id);

         query.$or = [
             { owner: { $in: userIds } },
             { guest: { $in: guestUsersIds } },
             { outlet: { $in: outletIds } },
         ];
    }

    try {

        let reports=await Report.find(query)
                        .sort({createdAt:-1})
                        .skip((page-1) * pageSize)
                        .limit(pageSize)
                        .populate({path:"userId",select: 'name email image whatsappNumber'})
                        .select("userId reportedUserId reportReason")


        let responseData= await Promise.all(reports.map(async(ele)=>{

            const data={
                id: ele._id,
                name:ele.userId?.name,
                userImage:ele.userId?.image[0],
                userId:ele.userId?._id,
                number: ele.userId?.whatsappNumber,
                email: ele.userId?.email,
                reason: ele.reportReason,


            }

            return data

        }))

        res.status(200).json({responseData});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
    

}


// apis for Home page 

    // api for currentActiveUsers,todayOfferSent,todayMeetupCreated,cafePartners,totalQueries,todayRevenue,usersCount,paidUsersCount,unPaidUsersCount

const forUpperBoxs=async(req,res)=>{


    const { startDate,endDate } = req.query;

    let startDateString,endDateString

    if(startDate){
        if(startDate && endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
            let endDateArray= endDate.split("/");
            endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

        }else if(startDate && !endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";   
            endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";
        }
    }
    else{
        startDateString = new Date();
        startDateString.setDate(startDateString.getDate() - 7);
        // Set time to 00:00:00
        startDateString.setUTCHours(0, 0, 0, 0);
        
        endDateString = new Date();
        
        // Set time to 23:59:59
        endDateString.setUTCHours(23, 59, 59, 999);
    }

    // for current active users
    let queryForCurrentUsers = {updatedAt: { $gte: startDateString, $lte: endDateString }};

    // query for current swipe

    

    try {
        // total Users

        let totalUser= await User.countDocuments();

        let totalMaleUsers= await User.countDocuments({gender:"Male"});
        let totalFemaleUsers= await User.countDocuments({gender:"Female"});

        let totalUsers={
            totalUser,
            totalMaleUsers,
            totalFemaleUsers
        }

        //currentActiveUsers
        let currentActiveUser= await User.countDocuments(queryForCurrentUsers);

        let currentActiveMale= await User.countDocuments({...queryForCurrentUsers,gender:"Male"});
        let currentActiveFemale= await User.countDocuments({...queryForCurrentUsers,gender:"Female"});

        let currentActiveUsers={
            currentActiveUser,
            currentActiveMale,
            currentActiveFemale
        }


        //today's swipe
        let totalSwipes= await SubscriptionChecks.aggregate([{$group:{_id:null,totalCount:{$sum:"$profileCount"}}}]);

        totalSwipes=totalSwipes[0].totalCount;
        

    
        //today offerSent
        let currentOfferSent= await Offer.countDocuments({createdAt:{$gte:startDateString,$lte:endDateString},status:{$nin:["shared", "consumed", "expired"]}});
        
        // today's meetups created
        let TotalMeetupCreated= await Offer.countDocuments({status:{$nin:["shared", "consumed", "expired"]}});


        // total cafe partners
        let cafePartners= await Outlet.countDocuments();

        // total quires
        let totalQueries= await Userquery.countDocuments();



        // all users 
        let usersCount= await User.countDocuments({createdAt:{$gte:startDateString,$lte:endDateString}});

        // paid users 
        let paidUsersCount= await User.countDocuments({createdAt:{$gte:startDateString,$lte:endDateString},subscription:true});

        //unpaid users 
        let unPaidUsersCount= await User.countDocuments({createdAt:{$gte:startDateString,$lte:endDateString},subscription:false});

        res.status(200).json({totalUsers,currentActiveUsers,totalSwipes,currentOfferSent,TotalMeetupCreated,cafePartners,totalQueries,usersCount,paidUsersCount,unPaidUsersCount})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}


const calculateTimeDiffrence=(createdAt)=>{

            let timeDiff;
            const now = new Date();
            const diffInSeconds = Math.floor((now - createdAt) / 1000); 

            if (diffInSeconds < 60) {
                timeDiff = "Just now";
            } else if (diffInSeconds >= 60 && diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                timeDiff = `${minutes} min${minutes > 1 ? "s" : ""} ago`;
            } else if (diffInSeconds >= 3600 && diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                timeDiff = `${hours} hr${hours > 1 ? "s" : ""} ago`;
            } else if (diffInSeconds >=86400) {
                const days= Math.floor(diffInSeconds/86400);
                timeDiff= `${days} day${days > 1 ? "s" : ""} ago`
            }

            return timeDiff;
}



// new_users for home 

const homeNewUser=async(req,res)=>{
    const{userPage=1,reportPage=1}=req.query;
    

    try {
        const newUsers=await User.find()
                        .sort({createdAt:-1})
                        .skip((userPage-1)*5)
                        .limit(5)
                        .select("name createdAt");

        let newUserResponce= await Promise.all(newUsers.map(async(ele)=>{
            const createdAt = ele.createdAt; 
            const timeDiff= calculateTimeDiffrence(createdAt);
            let data={
                userId:ele._id,
                userName:ele.name,
                userImage: ele.image ? ele.image.length>0 ? ele.image[0] : "https://picsum.photos/200/300" :"https://picsum.photos/200/300",
                timeDiff
            }
            return data;
        }))

        res.status(200).json({newUserResponce})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const homeNewReport=async(req,res)=>{

    const {page=1}=req.query;

    try {

        const newReports=await Report.find()
                        .sort({createdAt:-1})
                        .skip((page-1)*3)
                        .limit(3)
                        .populate({path:"userId",select: 'name image'})
                        .select("userId reportReason createdAt");

        let newReportResponce= await Promise.all(newReports.map(async(ele)=>{
            const createdAt = ele.createdAt; 
            const timeDiff= calculateTimeDiffrence(createdAt);
            
            let data={
                userId:ele.userId?._id,
                userName:ele.userId?.name,
                userImage: ele.userId?.image ? ele.userId?.image.length>0 ? ele.userId?.image[0] : "https://picsum.photos/200/300" :"https://picsum.photos/200/300",
                report:ele.reportReason,
                timeDiff
            }
            return data;
        }))

        res.status(200).json({newReportResponce})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


const homeNewMatch=async(req,res)=>{

    try {

        const newMatch=await Room.find({offerStatus:"shared"})
                        .sort({createdAt:-1})
                        .limit(3)
                        .populate({path:"offer",select: 'time outlet orderDetails',populate:{path:"orderDetails.forYou", select:'name'},populate:{path:"orderDetails.forMe", select:'name'},populate:{path:"outlet",select:"name"}})
                        .select("firstUser secondUser offer createdAt");

        let newMatchResponce= await Promise.all(newMatch.map(async(ele)=>{
            const createdAt = ele.createdAt; 
            const timeDiff= calculateTimeDiffrence(createdAt);

            let offerDate="-"

            if(ele.offer?.time){
                const originalDateString = ele.offer?.time;

                // Parse the original date string
                const originalDate = new Date(originalDateString);

                // Define the desired date format options
                const dateFormatOptions = {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: 'UTC',
                };

                // Format the date using Intl.DateTimeFormat
                offerDate = new Intl.DateTimeFormat('en-US', dateFormatOptions).format(originalDate);

            }
            
            

            
            let data={
                firstUser:ele.firstUser?.name,
                firstUserimage:ele.firstUser?.image,
                secondUser:ele.secondUser?.name,
                secondUserimage:ele.secondUser?.image,
                offerItem:ele.offer
                ? ele.offer.orderDetails
                  ? ele.offer.orderDetails.forYou
                    ? ele.offer.orderDetails.forYou.name
                    : ele.offer.orderDetails.forMe
                      ? ele.offer.orderDetails.forMe.name
                      : "-"
                  : "-"
                : "-",
                offerDate,
                restaurant:ele.offer?.outlet.name,
                timeDiff
            }
            return data;
        }))

        res.status(200).json({newMatchResponce})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}


const homeMostOfferingItem=async(req,res)=>{

    const { startDate,endDate } = req.query;

    let startDateString,endDateString

    if(startDate){
        if(startDate && endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
            let endDateArray= endDate.split("/");
            endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

        }else if(startDate && !endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";   
            endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";
        }
    }
    else{
        startDateString = new Date();
        startDateString.setDate(startDateString.getDate() - 7);
        // Set time to 00:00:00
        startDateString.setUTCHours(0, 0, 0, 0);
        
        endDateString = new Date();
        
        // Set time to 23:59:59
        endDateString.setUTCHours(23, 59, 59, 999);
    }

    try {

        let itemsForMe= await Offer.aggregate([{$match:{createdAt:{$gte:new Date(startDateString),$lte:new Date(endDateString)}}},{$group:{_id: "$orderDetails.forMe.item",count: { $sum: 1 }}}]);
        let itemsForYou= await Offer.aggregate([{$match:{createdAt:{$gte:new Date(startDateString),$lte:new Date(endDateString)}}},{$group:{_id: "$orderDetails.forYou.item",count: { $sum: 1 }}}])
        let itemObject={};

       
        itemsForMe.forEach((el)=>{
            if(itemObject[el._id]==undefined){
                itemObject[el._id]=el.count;
            }else{
                itemObject[el._id]=itemObject[el._id]+el.count;
            }
        })

        itemsForYou.forEach((el)=>{
            if(itemObject[el._id]==undefined){
                itemObject[el._id]=el.count;
            }else{
                itemObject[el._id]=itemObject[el._id]+el.count;
            }
        })

        // Convert the object to an array of key-value pairs
        const itemsArray = Object.entries(itemObject);

        
        // Sort the array based on the values (second element of each pair)
        itemsArray.sort((a, b) => b[1] - a[1]);

        // Convert the sorted array back to an object
        const sortedItemObject = Object.fromEntries(itemsArray);

        let showArray=[];

        for(let key in sortedItemObject){
            if(key!=="null" && showArray.length<3){
                showArray.push([key,sortedItemObject[key]]);
            }
        }

        let firstOfferingItem={id:"-",name:"-",count:"-"},secondOfferingItem={id:"-",name:"-",count:"-"},thirdOfferingItem={id:"-",name:"-",count:"-"} ;

        if(showArray.length>0){
            firstOfferingItem= await OutletMenu.findOne({_id:showArray[0][0]})
                            .select("name")

            firstOfferingItem={id:showArray[0][0],
                            name:firstOfferingItem?firstOfferingItem.name:"-",
                            count:showArray[0][1]
                            }
        
        }
        

        if(showArray.length>1){
            secondOfferingItem= await OutletMenu.findOne({_id:showArray[1][0]})
                            .select("name")
        
            secondOfferingItem={id:showArray[1][0],
                            name:secondOfferingItem?secondOfferingItem.name:"-",
                            count:showArray[1][1]
                            }

        }

        if(showArray.length>2){
            thirdOfferingItem= await OutletMenu.findOne({_id:showArray[2][0]})
                            .select("name")

            thirdOfferingItem={id:showArray[2][0],
                                name:thirdOfferingItem?thirdOfferingItem.name:"-",
                                count:showArray[2][1]
                                }
        
        }
        
        
        res.status(200).json({firstOfferingItem,secondOfferingItem,thirdOfferingItem})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

    
}

const homeAlertRaised=async(req,res)=>{

    const {page=1}=req.query;

    try {

        let alerts=await Arrival.find({alert:true})
                    .sort({createdAt:-1})
                    .skip((page-1)*1)
                    .limit(1)
                    .populate({path:"outlet",select:"name managerContact"})
                    .populate({path:"offer",select: 'owner guest',populate:{path:"owner guest", select:'name image whatsappNumber'}})
                    .select("guest outlet offer  alertReason alertResolution time")


        let responseData= await Promise.all(alerts.map(async(ele)=>{

            let date, time;
            
            if (!(ele.time === "Invalid Date" || !ele.time)) {
                console.log(ele.time);
                let dateObject = new Date(ele.time);
            
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";
            
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;
            }
            
            let alertStatus= ele.alertResolution?"resolved":"unresolved"
            
            const data={
                id: ele._id,
                date,
                time,
                hostName:ele.offer?.owner?.name,
                hostid:ele.offer?.owner?._id,
                hostImage:ele.offer?.owner?.image[0],
                guestName:ele.offer?.guest?.name,
                guestid:ele.offer?.guest?._id,
                guestImage:ele.offer?.guest?.image[0],
                restaurantName:ele.outlet?.name,
                restaurantAddress:ele.outlet?.address?ele.outlet?.address:"-",
                alertReason:ele.alertReason,
                alertStatus,
                restaurantNumber:ele.outlet?.managerContact,
                hostNumber: ele.offer?.owner?.whatsappNumber,
                guestNumber: ele.offer?.guest?.whatsappNumber
            
                }
            
                return data
            
                }))

        res.status(200).json({responseData})

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}


const homeRevenue=async(req,res)=>{

    const { startDate,endDate } = req.query;

    let startDateString,endDateString

    if(startDate){
        if(startDate && endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";
            let endDateArray= endDate.split("/");
            endDateString=endDateArray[2]+"-"+endDateArray[1]+"-"+endDateArray[0]+"T23:59:59.999Z";

        }else if(startDate && !endDate){
            let startDateArray= startDate.split("/");
            startDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T00:00:00.000Z";   
            endDateString=startDateArray[2]+"-"+startDateArray[1]+"-"+startDateArray[0]+"T23:59:59.999Z";
        }
    }
    else{
        startDateString = new Date();
        startDateString.setDate(startDateString.getDate() - 7);
        // Set time to 00:00:00
        startDateString.setUTCHours(0, 0, 0, 0);
        
        endDateString = new Date();
        
        // Set time to 23:59:59
        endDateString.setUTCHours(23, 59, 59, 999);
    }

    try {

        let revenueAmount=await Ledger.aggregate([{$match:{createdAt:{$gte: new Date(startDateString),$lte:new Date(endDateString)}}},{$group:{_id:null,totalAmount:{$sum:"$amount"}}}])
        revenueAmount=revenueAmount.length>0 ? revenueAmount[0].totalAmount : 0;
        revenueAmount=Math.floor(revenueAmount);

        let newTransition= await Ledger.find()
                            .sort({createdAt:-1})
                            .limit(5)
                            .populate({path:"userId",select:"name image"})
                            .select("userId amount createdAt")

        let transitionResponce= await Promise.all(newTransition.map(async(ele)=>{

            let date, time;

            if (!(ele.createdAt === "Invalid Date" || !ele.createdAt)) {
                console.log(ele.createdAt);

                let dateObject = new Date(ele.createdAt);
                date = dateObject.toISOString().split("T")[0];
                let hours = dateObject.getUTCHours();
                let minutes = dateObject.getUTCMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                time = hours + ":" + minutes + " " + ampm;
            }

            let userInfo= await User.findOne({_id:ele.userId});

            let data={
                id:ele._id,
                name: userInfo?.name,
                userId: userInfo?._id,
                image:userInfo?.image ?userInfo?.image[0]:"https://picsum.photos/200/300",
                amount:ele.amount,
                date,
                time
            }

            return data
        }))
                            
        res.status(200).json({revenueAmount,transitionResponce});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}

// api for home traffic

const homeTraffic=async(req,res)=>{

    try {

        const userTraffic = await User.aggregate([
            {
                $addFields: {
                    townArray: { $split: ["$location", ","] },
                },
            },
            {
                $addFields: {
                    town: { $arrayElemAt: ["$townArray", -3] },
                },
            },
            {
                $addFields: {
                    town: { $trim: { input: "$town" } },
                },
            },
            
            {
                $group: {
                    _id: "$town",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 } // Sort by the 'count' field in descending order
            }
        ]);

        res.status(200).json({userTraffic})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }

}


module.exports = {
    approveStatusForCoupon,
    getEarlyBirdUserData,
    getEarlyBirdUsers,
    getUsers,
    secondOffer,
    verifyProfile,
    denyUserVerification,
    getCoffeeClaimed,
    getAllUsers,
    getUser,
    bookingHistory,
    getOutlets,
    weeklyReservation,
    userTraffic,
    getCafeCity,
    purchase,
    getUserCity,
    userProfiles,
    meetupshistory,
    cityDetails,
    partnerData,
    offerCreation,
    matched,
    offerExpired,
    creditAmount,
    //  addUserQuery,
    userQuery,
    addResolutionquery,
    userMatches,
    userMeetups,
    userDeals,
    usersDataMeetups,
    verifiedUsers,
    unVerifiedUsers,
    refundRequest,
    selectRestaurants,
    menuItems,
    claimOfferSubmit,
    blockUser,
    partnerDataById,
    partnerMenuItems,
    userAlert,
    userReport,
    forUpperBoxs,
    homeNewUser,
    homeNewReport,
    homeNewMatch,
    homeMostOfferingItem,
    homeAlertRaised,
    homeRevenue,
    homeTraffic
};
