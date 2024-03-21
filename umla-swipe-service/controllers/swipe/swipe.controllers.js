const {
    User,
    Swipe,
    Room,
    Offer,
    OfferResponse,
    SubscriptionChecks,
    GroupOfferResponse,
    GroupMeetOffer,
} = require("../../models/index.models");
const { sendPushNotification } = require("../../utils/notification.utils");

//DONE
const handleSwipe = async (req, res) => {
    const userId = req.user.id;
    const { actionType, secondUserId,likeSwipe=false,responceSwipe=false } = req.body;
    
    try {
        // const user = await User.findById(userId);
        const userSwipeData1 = await Swipe.findOne({ uid: userId });
        userSwipeData1.swipeId.push(secondUserId);
        if(likeSwipe){
            userSwipeData1.likesRemaining=userSwipeData1.likesRemaining-1
        }
        if(responceSwipe){
            userSwipeData1.responsesRemaining=userSwipeData1.responsesRemaining-1
        }
        await userSwipeData1.save();
        const data1 = await SubscriptionChecks.findOne({
            uid: userId,
        });
        if (!data1) {
            await SubscriptionChecks.create({
                uid: userId,
            });
        }
        const subscriptionChecks = await SubscriptionChecks.findOne({
            uid: userId,
        });
        if (!subscriptionChecks.profileCount) {
            subscriptionChecks.profileCount = 0;
        }
        subscriptionChecks.profileCount += 1;
        if (subscriptionChecks.profileCount >= 20) {
            if (!subscriptionChecks.profileLimit) {
                subscriptionChecks.profileLimit = true;
            }
        }
        
        await subscriptionChecks.save();
        const userSwipeData = await Swipe.findOne({ uid: userId });
        // const secondUser = await User.findById(secondUserId);
        const secondUserSwipeData = await Swipe.findOne({ uid: secondUserId });
        //left swipe
        if (actionType === "left") {
            userSwipeData.left.push(secondUserId);
            userSwipeData.gotRight.pull(secondUserId)
            await userSwipeData.save();
            return res.status(200).json({ success: true, matched: [] });
        }
        if (!userSwipeData.info) {
            userSwipeData.info.swipeCount = 0;
            userSwipeData.info.femaleSwipe = 0;
            userSwipeData.info.maleSwipe = 0;
            userSwipeData.info.otherSwipe = 0;
        }
        userSwipeData.info.swipeCount += 1;
        //right swipe (match)
        if (
            secondUserSwipeData.right.includes(userId) &&
            userSwipeData.gotRight.includes(secondUserId)
        ) {
            userSwipeData.match.push(secondUserId);
            userSwipeData.gotRight.pull(secondUserId);
            secondUserSwipeData.match.push(userId);
            secondUserSwipeData.right.pull(userId);

            await secondUserSwipeData.save();
            const secondUser = await User.findById(secondUserId);
            const user = await User.findById(userId);
            // if (secondUser.offer) {
            // 	const offerResponse = await Offer.findOne({
            // 		offerId: secondUser.offer,
            // 	});
            // 	offerResponse.users.push(userId);
            // 	await offerResponse.save();
            // }
            if (secondUser.gender === "Female") {
                userSwipeData.info.femaleSwipe += 1;
            } else {
                if (secondUser.gender === "Male") {
                    userSwipeData.info.maleSwipe += 1;
                } else {
                    userSwipeData.info.otherSwipe += 1;
                }
            }
            await userSwipeData.save();
            await sendPushNotification(
                secondUser.deviceId,
                "It's a Match!",
                `Send a offer to ${user.name} to show your interest`,
                "Match"
            );
            const room = new Room({
                firstUser: {
                    userId: user._id,
                    name: user.name,
                    image: user.image[0] || null,
                },
                secondUser: {
                    userId: secondUser._id,
                    name: secondUser.name,
                    image: secondUser.image[0] || null,
                },
            });
            const data = await room.save();
            return res.status(200).json({
                success: true,
                matched: [
                    {
                        name: secondUser.name,
                        image: secondUser.image[0],
                        room: data,
                    },
                ],
            });
        }

        //right swipe
        const secondUser = await User.findById(secondUserId);
        userSwipeData.right.push(secondUserId);
        secondUserSwipeData.gotRight.push(userId);
        
        if (secondUser.offer) {
            const offerResponse1 = await OfferResponse.findOne({
                offerId: secondUser.offer,
            });
            if (!offerResponse1) {
                await OfferResponse.create({ offerId: secondUser.offer });
            }
            const offerResponse = await OfferResponse.findOne({
                offerId: secondUser.offer,
            });
            offerResponse.users.push(userId);
            const len = offerResponse.users.length;
            offerResponse.users = [...new Set(offerResponse.users)];
            await offerResponse.save();
            const offer = await Offer.findById(secondUser.offer);
            if (offerResponse.users.length === len) {
                offer.responseCount += 1;
            }
            await offer.save();
        }

        //if  user have group offer also.

        if (secondUser.groupOffer) {
            const groupOfferResponse1 = await GroupOfferResponse.findOne({
                groupOfferId: secondUser.groupOffer,
            });
            if (!groupOfferResponse1) {
                await GroupOfferResponse.create({ groupOfferId: secondUser.groupOffer });
            }
            const groupOfferResponse = await GroupOfferResponse.findOne({
                groupOfferId: secondUser.groupOffer,
            });
            GroupOfferResponse.users.push(userId);
            const len = GroupOfferResponse.users.length;
            groupOfferResponse.users = [...new Set(groupOfferResponse.users)];
            await groupOfferResponse.save();
            const groupOffer = await GroupMeetOffer.findById(secondUser.secondUser.groupOffer);
            if (groupOfferResponse.users.length === len) {
                groupOffer.responseCount += 1;
            }
            await groupOffer.save();
        }
        


        await sendPushNotification(
            secondUser.deviceId,
            "Someone liked you profile!",
            `Let's find the perfect match for you`,
            "like"
        );
        if (secondUser.gender === "Female") {
            userSwipeData.info.femaleSwipe += 1;
        } else {
            if (secondUser.gender === "Male") {
                userSwipeData.info.maleSwipe += 1;
            } else {
                userSwipeData.info.otherSwipe += 1;
            }
        }
        await userSwipeData.save();
        await userSwipeData.save();
        await secondUserSwipeData.save();
        return res.status(200).json({ success: true, matched: [] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

//DONE // resetAt: { $lte: new Date() },
const resetLikesCronRoute = async (req, res) => {
    const { page } = req.body;
    try {
        const data = await Swipe.find({})
            .limit(100)
            .skip(100 * page);
        let responseCount = data.length;
        const resetDate = new Date();
        resetDate.setDate(resetDate.getDate() + 3);

        // Create an array to hold all the promises
        let promises = [];

        for (let swipeData of data) {
            const currentDate = new Date();
            if (currentDate >= swipeData.resetAt) {
                swipeData.left = [];
                swipeData.right = [];
                swipeData.gotRight = [];
                swipeData.swipeId = [];
                swipeData.resetAt = resetDate;
                swipeData.markModified("left");
                swipeData.markModified("right");
                swipeData.markModified("gotRight");

                // Push the promise into the array
                promises.push(swipeData.save());
            }
        }

        // Wait for all promises to resolve
        await Promise.all(promises);

        res.status(200).json({ count: responseCount });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleSwipe, resetLikesCronRoute };
