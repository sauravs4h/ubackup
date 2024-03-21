const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
	{
		name: String,
		email: String,
		password: String,
		role: {
			type: String,
			enum: ['owner', 'admin', 'sub-admin'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
