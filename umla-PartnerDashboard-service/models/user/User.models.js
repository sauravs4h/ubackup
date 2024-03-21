const mongoose = require("mongoose");
var pincodeDirectory = require("india-pincode-lookup");

const schedule = require("node-schedule");
const { User } = require("../index.models");

const userSchemaModel = new mongoose.Schema(
    {
        contactNumber: {
            type: String,
        },
        name: String,
        bio: String,
        deviceId: String,
        email: String,
        dob: String,
        age: Number,
        pronouns: String,
        sexualOrientation: String,
        profession: {
            jobTitle: String,
            companyName: String,
        },
        education: {
            instituteName: String,
            year: String,
            lvl: String,
        },
        interest: {
            drinks: [String],
            food: [String],
            place: [String],
            hobbies: [String],
        },
        favCafe: [String],
        image: [String],
        location: String,
        homeTown: String,
        language: [String],
        blocked: {
            type: Boolean,
            default: false,
        },
        notification: {
            type: Boolean,
            default: false,
        },
        groupOffer:{
            type: mongoose.Types.ObjectId,
            ref: "GroupMeetOffer",
        },
        offer: {
            type: mongoose.Types.ObjectId,
            ref: "Offer",
        },
        completed: { type: Boolean, default: false },
        loc: {
            type: {
                type: String,
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },

        hideTime:{
            shouldHide:{
                type:Boolean,
                default:false
            },
            timeTillHide:{
                type:Date
            }
        },
        subscription: { type: Boolean, default: false },
        gender: String,
        ethnicity: String,
        starSign: String,
        height: String,
        heightInNumber: Number,
        travel: Boolean,
        referralCode: String,
        completionPercentage: {
            type: Number,
            default: 0,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        drinking: {
            type: String,
        },

        exercising: {
            type: String,
        },

        smoking: {
            type: String,
        },

        kids: {
            type: String,
        },

        politicalViews: {
            type: String,
        },
        religion: {
            type: String,
        },
        claimOffer: { type: Boolean, default: false },
        claimable: { type: Boolean, default: false },
        earlyBird: { type: Boolean, default: false },
        referredBy: { type: Boolean, default: false },
        whatsappNumber: String,
        jaipur: { type: Boolean, default: false },
        verificationImage: String,
        earlyBirdCouponClaimed: { type: Boolean, default: false },
        offerTwo: {
            days: {
                type: Number,
                default: 0,
            },
            offerBool: { type: Boolean, default: false },
        },
        snoozed: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
        verificationDenied: { type: Boolean, default: false },
        reasonToDelete: String,
        state: String,
    },
    { timestamps: true }
);

userSchemaModel.index({ loc: "2dsphere" });
userSchemaModel.index({ createdAt: 1 });

userSchemaModel.pre("save", async function (next) {
    let user = this;

    if (user.location && !user.state) {
        const locationParts = user.location.split(","); // Split the location string into parts
        const pinIndex = locationParts.length - 2; // Get the index of the pincode
        let pincode = locationParts[pinIndex];
        pincode = Number(pincode);

        const stateResponce = pincodeDirectory.lookup(pincode);

        let state = stateResponce[0].stateName;
        user.state = state;
    }

    if (user.height && !user.heightInNumber) {
        let numHeight = Number(user.height);
        user.heightInNumber = numHeight;
    }
    // if (user.isModified('claimOffer') && user.claimOffer) {
    // 	// Schedule a job for 24 hours later
    // 	let date = new Date();
    // 	date.setHours(date.getHours() + 24);

    // 	schedule.scheduleJob(date, async function () {
    // 		await User.findByIdAndUpdate(user._id, { claimable: true });
    // 	});
    // }

    next();
});

module.exports = mongoose.model("User", userSchemaModel);
