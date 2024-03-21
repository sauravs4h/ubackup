const {
    User,
    Swipe,
    Chat,
    Room,
    Offer,
    Outlet,
} = require("../../models/index.models");
const { sendPushNotification } = require("../../utils/notification.utils");

const handleMessage = async (targetId, senderId, msgContent,messageSeen) => {
    try {
        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": targetId },
                        { "firstUser.userId": senderId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": targetId },
                        { "secondUser.userId": senderId },
                    ],
                },
            ],
        });
        console.log("room ", room._id);
        if (room) {
            const time = new Date();
            const chatMessage = new Chat({
                roomId: room._id,
                senderId,
                message: msgContent,
                time,
                seen: messageSeen,
            });
            room.lastMessage.message = msgContent;
            room.lastMessage.time = time;
            await room.save();
            await chatMessage.save();
        }
    } catch (err) {
        console.log(err);
    }
};

const handleOfflineTarget = async (targetId, senderId, msgContent) => {
    try {
        console.log("offline target");
        const sender = await User.findById(senderId);
        const target = await User.findById(targetId);
        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": targetId },
                        { "firstUser.userId": senderId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": targetId },
                        { "secondUser.userId": senderId },
                    ],
                },
            ],
        });
        console.log("offline target...... ",target);
        const response = await sendPushNotification(
            target.deviceId,
            sender.name,
            msgContent,
            true,
            room._id,
            senderId,
            sender.name,
            sender.image[0]
        );
        console.log("response ", response.data);
    } catch (err) {
        console.log(err);
    }
};

const getAvailableRooms = async (req, res) => {
    const userId = req.user.id; /////TODO: integrate coupons
    try {
        const rooms = await Room.find({
            $or: [
                { "firstUser.userId": userId },
                { "secondUser.userId": userId },
            ],
        })
            .select("-__v -createdAt")
            .populate({
                path: "offer",
                select: "-createdAt -updatedAt",
                populate: [
                    { path: "owner", model: "User" },
                    { path: "guest", model: "User" },
                    { path: "outlet", model: "Outlet" },
                    { path: "orderDetails.forMe.item", model: "OutletMenu" },
                    { path: "orderDetails.forYou.item", model: "OutletMenu" },
                ],
            })
            .populate({
                path: "firstUser.coupon",
                model: "Coupon",
                select: "-createdAt -updatedAt",
                populate: [
                    { path: "offer", model: "Offer" },
                    { path: "item", model: "OutletMenu" },
                    { path: "outlet", model: "Outlet" },
                    { path: "owner", model: "User" },
                    { path: "meetingWith", model: "User" },
                ],
            })
            .populate({
                path: "secondUser.coupon",
                model: "Coupon",
                select: "-createdAt -updatedAt",
                populate: [
                    { path: "offer", model: "Offer" },
                    { path: "item", model: "OutletMenu" },
                    { path: "outlet", model: "Outlet" },
                    { path: "owner", model: "User" },
                    { path: "meetingWith", model: "User" },
                ],
            })
            .sort({ updatedAt: -1 })
            .lean();

        const response = await Promise.all(
            rooms.map(async (ele) => {

                let targetId= ele.firstUser.userId==userId ? ele.secondUser.userId : ele.firstUser.userId;

                let unSeenMessageCount = await Chat.countDocuments({
                    roomId: ele._id,
                    senderId: targetId,
                    seen: false,
                });

                let firstUser = await User.findById(ele.firstUser.userId);
                let firstUserDeviceId = firstUser ? firstUser.deviceId : null;
                let firstUserVerifyStatus=firstUser ? firstUser.verified :false;

                let secondUser = await User.findById(ele.secondUser.userId);
                let secondUserDeviceId = secondUser
                    ? secondUser.deviceId
                    : null;
                let secondUserVerifyStatus=secondUser ? secondUser.verified :false;
                

                // last message is seen or unseen

                let lastMessageSeenStatus= await Chat.findOne({
                    roomId:ele._id,
                    message: ele.lastMessage.message,
                    time:ele.lastMessage.time
                });

                lastMessageSeenStatus=lastMessageSeenStatus? lastMessageSeenStatus.seen : false


                const data = {
                    _id: ele._id,
                    firstUser: {
                        userId: ele.firstUser.userId,
                        name: ele.firstUser.name,
                        image: ele.firstUser.image,
                        deviceId: firstUserDeviceId,
                        coupon: ele.firstUser.coupon?._id || null,
                        verified:firstUserVerifyStatus
                    },
                    secondUser: {
                        userId: ele.secondUser.userId,
                        name: ele.secondUser.name,
                        image: ele.secondUser.image,
                        deviceId: secondUserDeviceId,
                        coupon: ele.secondUser.coupon?._id || null,
                        verified:secondUserVerifyStatus
                    },
                    lastMessage: ele.lastMessage,
                    lastMessageSeenStatus,
                    offerStatus: ele.offerStatus || null,
                    blocked: ele.blocked || false,
                    unSeenMessageCount,
                    updatedAt: ele.updatedAt,
                };

                if (ele.offer) {
                    data.offer = {
                        _id: ele.offer?._id || null,
                        outletName: ele.offer?.outlet?.name || null,
                        address: ele.offer?.address || "-",
                        orderDetails: {
                            forMe: {
                                item: {
                                    name:
                                        ele.offer?.orderDetails?.forMe?.item
                                            ?.name || null,
                                },
                            },
                            forYou: {
                                item: {
                                    name:
                                        ele.offer?.orderDetails?.forYou?.item
                                            ?.name || null,
                                },
                            },
                        },
                        owner: ele.offer?.owner?._id || null,
                        time: ele.offer?.time || null,
                    };
                }

                return data;
            })
        );

        res.status(200).json({ rooms: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getChat = async (req, res) => {
    const { roomId, page } = req.params;
    try {
        const pageNumber = page || 0;
        const chat = await Chat.find({ roomId })
            .sort({ time: -1 })
            .skip(pageNumber * 50)
            .limit(50);
        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const unmatch = async (req, res) => {
    const { roomId } = req.body;
    try {
        const room = await Room.findById(roomId).exec();
        const firstUserId = room.firstUser.userId;
        const secondUserId = room.secondUser.userId;

        const [firstUserSwipe, secondUserSwipe] = await Promise.all([
            Swipe.findOne({ uid: firstUserId }).exec(),
            Swipe.findOne({ uid: secondUserId }).exec(),
        ]);

        // Remove room.firstUser.userId from firstUserSwipe's match array
        firstUserSwipe.match.pull(secondUserId);

        // Remove room.secondUser.userId from secondUserSwipe's match array
        secondUserSwipe.match.pull(firstUserId);

        // Save the updated documents
        await Promise.all([
            firstUserSwipe.save(),
            secondUserSwipe.save(),
            Chat.deleteMany({ roomId: room._id }),
            Room.deleteOne({ _id: room._id }),
        ]);
        res.status(200).json({ message: "unmatched successful" });
    } catch (err) {
        console.log(err);
        res.status(200).json({ message: "something went wrong" });
    }
};

const handleOfferResponseInChatByGuest = async (req, res) => {
    const {
        user: { id: userId },
        body: { offerId, response },
    } = req;

    try {
        const [offer, currentUser, ownerUser] = await Promise.all([
            Offer.findById(offerId),
            User.findById(userId).select("name"),
            User.findById(offer.owner).select("deviceId"),
        ]);

        const room = await Room.findOne({
            $or: [
                { "firstUser.userId": { $in: [offer.guest, offer.owner] } },
                { "secondUser.userId": { $in: [offer.guest, offer.owner] } },
            ],
        });

        switch (response) {
            case "accept":
                room.offerStatus = "accepted";
                await room.save();
                await sendPushNotification(
                    ownerUser.deviceId,
                    `${currentUser.name} accepted your offer`,
                    "Complete your payment to proceed"
                );
                await sendPushNotification(
                    ownerUser.deviceId,
                    `${currentUser.name} has declined your offer`,
                    "Your offer has been removed"
                );
                return res.status(200).json({ message: "Offer accepted." });

            case "decline":
                await Promise.all([
                    Swipe.updateOne(
                        { uid: userId },
                        { $pull: { match: ownerUser._id } }
                    ),
                    Swipe.updateOne(
                        { uid: offer.owner },
                        { $pull: { match: currentUser._id } }
                    ),
                    Room.deleteOne({ _id: room._id }),
                    Offer.deleteOne({ _id: offerId }),
                ]);

                return res.status(200).json({ message: "Offer declined." });
        }
    } catch (err) {
        console.log(err);
        res.status(200).json({ message: "something went wrong" });
    }
};

const handleUnreadMesaageCount = async (senderId) => {
    let count = await Chat.countDocuments({ senderId, seen: false });

    return count;
};

const makeSeenMessage = async (sourceId,targetId) => {
    try {
        // find the room

        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": targetId },
                        { "firstUser.userId": sourceId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": targetId },
                        { "secondUser.userId": sourceId },
                    ],
                },
            ],
        });

        console.log(".... seenRoom", room);
        console.log("....seenTargetid",targetId);
        console.log(".....seenSourseId",sourceId);

        if (room) {
            let chatMessage = await Chat.updateMany(
                { roomId: room._id, senderId: sourceId, seen: false },
                { seen: true }
            );
        }
    } catch (error) {
        console.log({ Error: `error while making messages seen ${error}` });
    }
};

const getAllConnectedUser = async (userId) => {
    try {
        const rooms = await Room.find({
            $or: [
                { "firstUser.userId": userId },
                { "secondUser.userId": userId },
            ],
        });

        let connectedUsers = rooms.map((ele) => {
            if (ele.firstUser.userId == userId) {
                return ele.secondUser.userId;
            } else {
                return ele.firstUser.userId;
            }
        });

        return connectedUsers;
    } catch (error) {
        console.log("error while getting connected users");
    }
};


const notificationTarget = async (targetId, senderId, msgContent) => {
    try {
        
        const sender = await User.findById(senderId);
        const target = await User.findById(targetId);
        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": targetId },
                        { "firstUser.userId": senderId },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": targetId },
                        { "secondUser.userId": senderId },
                    ],
                },
            ],
        });
        console.log("notification target...... ",target);
        const response = await sendPushNotification(
            target.deviceId,
            sender.name,
            msgContent,
            true,
            room._id,
            senderId,
            sender.name,
            sender.image[0]
        );
        console.log("response ", response.data);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    handleMessage,
    handleOfflineTarget,
    getAvailableRooms,
    getChat,
    unmatch,
    handleOfferResponseInChatByGuest,
    handleUnreadMesaageCount,
    makeSeenMessage,
    getAllConnectedUser,
    notificationTarget
};
