const mongoose = require("mongoose");

const groupMeetModel = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  guest: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  purpose: String,
  category: String, //art & culture,music,Science
  dateTime: Date,
  meetingType: String, //Fixed,Flexible
  groupSize: String,
  remainingSize:Number,
  offerStatus: {
    type: String,
    enum: ["pending", "accepted", "declined", "shared","expired"],
    default:"pending"
  }
});

module.exports = mongoose.model("GroupMeet", groupMeetModel);
