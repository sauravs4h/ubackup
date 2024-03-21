const { Subscription } = require("../../models/index.models");

const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().select("-__v");
        res.status(200).json({ subscriptions });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const addSubscription = async (req, res) => {
    const { name, price, validity, originalPrice } = req.body;
    try {
        const subscription = await Subscription.create({
            name,
            price,
            validity,
            originalPrice,
        });
        res.status(201).json({ subscription });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

const updateSubscription = async (req, res) => {
    const { name, price, validity, subscriptionId } = req.params;
    try {
        const subscription = await Subscription.findById(subscriptionId);
        if (name) {
            subscription.name = name;
        }
        if (price) {
            subscription.price = price;
        }
        if (validity) {
            subscription.validity = validity;
        }
        await subscription.save();
        res.status(20).json({ subscription });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" });
    }
};

module.exports = { updateSubscription, addSubscription, getAllSubscriptions };
