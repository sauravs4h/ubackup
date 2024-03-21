const mongoose = require("mongoose");

const userFilterMOdel = new mongoose.Schema(
    {
        userId: String,
        gender: {
            type: String,
            enum: ["Male", "Female", "Nonbinary", "Anyone"],
            default: "Anyone",
        },
        age: {
            type: [Number],
            default: [18, 38],
        },
        distance: {
            person: {
                type: Number,
                default: 30,
            },
            meetupLocation: {
                type: Number,
                default: 45,
            },
        },
        meetingTimeSlot: {
            type: String,
            enum: ["Morning", "Afternoon", "Evening", "All"],
            default: "All",
        },
        advance: {
            drinking: [
                {
                    type: String,
                },
            ],
            exercising: [
                {
                    type: String,
                },
            ],
            smoking: [
                {
                    type: String,
                },
            ],
            kids: [
                {
                    type: String,
                },
            ],
            starSign: [
                {
                    type: String,
                },
            ],
            politicalViews: [
                {
                    type: String,
                },
            ],
            religion: [
                {
                    type: String,
                },
            ],
            height: {
                min: {
                    type: Number,
                },
                max: {
                    type: Number,
                },
            },
        },
    },
    { timestamps: true }
);
userFilterMOdel.index({ createdAt: 1 });
module.exports = mongoose.model("UserFilter", userFilterMOdel);
