const mongoose = require('mongoose');

const aadhaarDataModel = new mongoose.Schema(
	{
		uid: String,
		ref_id: String,
		aadhaar: String,
		name: String,
		dob: String,
		gender: String,
		state: String,
		status: {
			type: String,
			enum: ['verified', 'failed'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('AadhaarData', aadhaarDataModel);
