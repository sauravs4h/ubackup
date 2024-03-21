const mongoose = require("mongoose");

const userSlot = new mongoose.Schema(
    {

        userId: String,
        date: Date,
        slot:{
            morningSlot:{
                timing:Date,
                isBooked: {
                    type:Boolean,
                    default:false
                }
            },
            afternoonSlot:{
                timing:Date,
                isBooked: {
                    type:Boolean,
                    default:false
                }
            },
            eveningSlot:{
                timing:Date,
                isBooked: {
                    type:Boolean,
                    default:false
                }
            }
        }
    },
    { timestamps: true }
);
userSlot.index({ createdAt: 1 });

module.exports = mongoose.model("Userslot", userSlot);