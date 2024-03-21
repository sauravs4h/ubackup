const mongoose = require("mongoose");

const groupMeetOfferModel = new mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
  guest: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  groupId:String,
  time: String,
  offering: String,
  dateTime:Date,
  purpose: String,
  meetingType: String, //Fixed,Flexible
  status: {
    type: String,
    enum: [
      "active",
      "floating",
      "shared",
      "consumed",
      "expired",
      "archived",
      "refunded",
      "paymentPending",
      "actionNeed",
    ],
  },
  outlet: {
    type: mongoose.Types.ObjectId,
    ref: "Outlet",
  },
  loc: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },
  orderDetails: {
    item: { type: mongoose.Types.ObjectId, ref: "OutletMenu" },
    quantity:Number
  },
  bill: {
    itemTotal: Number,
    tax: Number,
    platformCharge: Number,
    total: Number,
  },
  billStatus: {
    type: String,
    enum: ["success", "failed", "pending"],
  },
  arrivalStatus: [
    {
      userId: String,
      status: { type: Boolean, default: false },
    },
  ],

  responseCount: { type: Number, default: 0 },
});


module.exports= mongoose.model("GroupMeetOffer",groupMeetOfferModel)