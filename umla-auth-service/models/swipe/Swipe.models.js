const mongoose = require("mongoose");

const swipeModel = new mongoose.Schema(
    {
        uid: String,
        left: [String],
        right: [String],
        match: [String],
        gotRight: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        blockedUser: [String],
        resetAt: Date,
        info: {
            swipeCount: { type: Number, default: 0 },
            femaleSwipe: { type: Number, default: 0 },
            maleSwipe: { type: Number, default: 0 },
            otherSwipe: { type: Number, default: 0 },
        },
        swipeId: [String],
        likesRemaining:{type:Number, default:4},
        responsesRemaining:{type:Number, default:4},
    },
    { timestamps: true }
);
swipeModel.index({ createdAt: 1 });

swipeModel.pre("save", function (next) {
    this.left = [...new Set(this.left)];
    this.right = [...new Set(this.right)];
    this.match = [...new Set(this.match)];
    this.gotRight = [...new Set(this.gotRight.map(JSON.stringify))].map(
        JSON.parse
    );
    this.blockedUser = [...new Set(this.blockedUser)];
    this.swipeId = [
        ...new Set(
            ...this.left,
            ...this.right,
            ...this.match,
            ...this.blockedUser
        ),
    ];
    next();
});

module.exports = mongoose.model("Swipe", swipeModel);
