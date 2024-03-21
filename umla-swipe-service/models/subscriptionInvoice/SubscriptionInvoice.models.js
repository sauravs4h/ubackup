const mongoose = require('mongoose');

const subscriptionInvoiceSchemaModel = new mongoose.Schema(
	{
		invoiceNumber: String,
		customerNumber: String,
		userId: String,
		items: [
			{
				name: String,
				quantity: Number,
				validity: Number,
				price: Number,
			},
		],
		totalAmount: Number,
	},
	{ timestamps: true }
);
module.exports = mongoose.model(
	'SubscriptionInvoice',
	subscriptionInvoiceSchemaModel
);
