const mongoose = require("mongoose");

const TimeSlotModel = new mongoose.Schema({
    outletId: String,
    slots: [
        {
            date: String,
            time: [
                {
                    timing: String,
                    timeSlots: [
                        {
                            slotTime: String,
                            slotLeft: { type: Number, default: 2 },
                        },
                    ],
                },
            ],
        },
    ],
});
TimeSlotModel.index({ createdAt: 1 });
module.exports = mongoose.model("TimeSlot", TimeSlotModel);
