const {
    Chat,
    User,
    Room,
    Swipe,
    Admin,
    Offer,
    Ledger,
    Outlet,
    Partner,
    OutletMenu,
    OutletRating,
    PartnerAdmin,
    Subscription,
    OfferInvoice,
    UserSubscription,
    OutletMenuRating,
    SubscriptionInvoice,
} = require("../../models/index.models");

const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().select(
            "-__v -createdAt -updatedAt"
        );
        res.status(200).json({ subscriptions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const getUserSubscription = async (req, res) => {
    const userId = req.user.id;
    try {
        const data = await UserSubscription.findOne({
            userId,
        })
            .sort({ createdAt: -1 })
            .select("-createdAt -updatedAt");
        let response = "10/28/2099";
        if (data) {
            response = new Date(data.validity.till).toLocaleDateString();
        }
        const newArr = response.split("/");
        response = newArr[1] + "/" + newArr[0] + "/" + newArr[2];

        const userSubscription = await UserSubscription.find({
            userId,
        })
            .sort({ createdAt: -1 })
            .select("-createdAt -updatedAt");

        res.status(200).json({ date: response, userSubscription });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

module.exports = { getSubscriptions, getUserSubscription };
