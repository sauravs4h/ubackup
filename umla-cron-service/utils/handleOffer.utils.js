const User = require("../models/user/User.models");
const Coupon = require("../models/coupon/Coupon.models");
const Offer = require("../models/offer/Offer.models");
const Room = require("../models/room/Room.models");
const splitOffer = async (offerId) => {
    try {
        const offer = await Offer.findById(offerId);

        const [guestCoupon, ownerCoupon, room] = await Promise.all([
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
            Room.findOne({
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
            }),
        ]);
        // update room
        if (room.firstUser.userId === offer.owner.toString) {
            room.firstUser.coupon = ownerCoupon._id;
            room.secondUser.coupon = guestCoupon._id;
        } else {
            room.firstUser.coupon = guestCoupon._id;
            room.secondUser.coupon = ownerCoupon._id;
        }
        room.offerStatus = "shared";
        await room.save();

        const time = offer.time;
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 5);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
        const finalTime = new Date(time);
        console.log(currentTime);
        console.log(finalTime);
        const diffInMilliseconds =
            finalTime.getTime() - currentTime.getTime() + 30 * 60 * 1000; // 30 minutes in milliseconds
        //check if offer is used on the scheculed time +30min buffer, if not it will expire
        setTimeout(async () => {
            const offer = await Offer.findById(offerId);
            if (offer.status === "shared") {
                offer.status = "expired";
                await Coupon.updateMany(
                    { offer: offerId }, // query
                    { $set: { status: "expired" } } // update
                );
            }
        }, diffInMilliseconds); // 24 hours in milliseconds
        return { guestCoupon, ownerCoupon };
    } catch (err) {
        console.error(err);
    }
};

module.exports = { splitOffer };
