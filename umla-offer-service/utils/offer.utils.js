const {
    Offer,
    Coupon,
    Room,
    Arrival,
    User,
    OfferNotification,
} = require("../models/index.models");
const { sendPushNotification } = require("./notification.utils");

const handleOfferCreationInChatRoom = async (offerId, check) => {
    try {
        const offer = await Offer.findById(offerId);

        const room = await Room.findOne({
            $and: [
                {
                    $or: [
                        { "firstUser.userId": offer.guest },
                        { "firstUser.userId": offer.owner },
                    ],
                },
                {
                    $or: [
                        { "secondUser.userId": offer.guest },
                        { "secondUser.userId": offer.owner },
                    ],
                },
            ],
        });

        if (!room) {
            throw new Error("Room not found");
        }
        const owner = await User.findById(offer.owner);
        await OfferNotification.create({
            sentBy: owner.name,
            room: room._id,
            userId: offer.guest,
            superOffer: check,
        });

        room.offer = offerId;
        room.offerStatus = "pending";
        setTimeout(async () => {
            console.log("This will run after 30 minutes");
            const offerData = await Offer.findById(offerId);
            const roomData = await Room.findOne({
                $and: [
                    {
                        $or: [
                            { "firstUser.userId": offerData.guest },
                            { "firstUser.userId": offerData.owner },
                        ],
                    },
                    {
                        $or: [
                            { "secondUser.userId": offerData.guest },
                            { "secondUser.userId": offerData.owner },
                        ],
                    },
                ],
            });
            if (roomData.offerStatus === "pending") {
                await Room.updateMany(
                    {
                        $and: [
                            {
                                $or: [
                                    { "firstUser.userId": offerData.guest },
                                    { "firstUser.userId": offerData.owner },
                                ],
                            },
                            {
                                $or: [
                                    { "secondUser.userId": offerData.guest },
                                    { "secondUser.userId": offerData.owner },
                                ],
                            },
                        ],
                    },
                    {
                        $unset: {
                            offerStatus: 1,
                            offer: 1,
                        },
                    }
                );
                await Offer.findByIdAndUpdate(offerData._id, {
                    $set: { status: "expired" },
                });
                await OfferNotification.findOneAndUpdate(
                    { room: roomData._id },
                    {
                        $set: { status: "Completed" },
                    }
                );
            }
        }, 30 * 60 * 1000);
        await room.save();
        const user = await User.findById(offer.guest);
        await sendPushNotification(
            user.deviceId,
            `Someone sent you a offer`,
            `Explore your chats to find`
        );
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
};

const handleMatchViaOfferResponse = async (offerId) => {
    try {
        const offer = await Offer.findById(offerId);

        const [guestCoupon, ownerCoupon] = await Promise.all([
            Coupon.create({
                owner: offer.guest,
                offer: offer._id,
                item: offer.orderDetails.forYou.item,
                outlet: offer.outlet,
                status: "claimable",
                time: offer.time,
                meetingWith: offer.owner,
            }),
            Coupon.create({
                owner: offer.owner,
                offer: offer._id,
                item: offer.orderDetails.forMe.item || null,
                outlet: offer.outlet,
                status: "claimable",
                time: offer.time,
                meetingWith: offer.guest,
            }),
        ]);
        await Arrival.create({
            offer: offer._id,
            time: offer.time,
            status: "upcoming",
            outlet: offer.outlet,
        });
        return { guestOfferId: guestCoupon._id, ownerOfferId: ownerCoupon._id };
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
};

module.exports = { handleOfferCreationInChatRoom, handleMatchViaOfferResponse };
