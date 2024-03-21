const mongoose = require("mongoose");

const groupMeetRoomModel = new mongoose.Schema(
    {
        owner: {
            userId: String,
            name: String,
            image: String,
            coupon: {
                type: mongoose.Types.ObjectId,
                ref: "Coupon",
            },
        },
        guest:[
            {
                userId: String,
                name: String,
                image: String,
                coupon: {
                    type: mongoose.Types.ObjectId,
                    ref: "Coupon",
                },
            }
        ] ,
        lastMessage: {
            message: {
                type: String,
                default: "",
            },

            time: {
                type: Date,
                default: "",
            },
        },
        offer: {
            type: mongoose.Types.ObjectId,
            ref: "GroupMeetOffer",
        },
        offerStatus: {
            type: String,
            enum: ["pending", "accepted", "declined", "shared"],
        },
       // blocked: { type: Boolean, default: false },
        
    },
    { timestamps: true }
);

groupMeetRoomModel.index({ updatedAt: 1 });
groupMeetRoomModel.index({ createdAt: 1 });

module.exports = mongoose.model("GroupMeetRoom", groupMeetRoomModel);
