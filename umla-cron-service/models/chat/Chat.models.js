const mongoose = require('mongoose');

const chatModel = new mongoose.Schema(
	{
		roomId: String,
		senderId: String,
		message: String,
		time: Date,
		seen: Boolean,
	},
	{ timestamps: true }
);

chatModel.index({ time: 1 });

module.exports = mongoose.model('Chat', chatModel);
