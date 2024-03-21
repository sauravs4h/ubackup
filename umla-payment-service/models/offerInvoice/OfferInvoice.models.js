const mongoose = require("mongoose");

const offerInvoiceSchemaModel = new mongoose.Schema(
    {
        invoiceNumber: String,
        customerName: String,
        userId: String,
        outletId: String,
        totalAmount: Number,
    },
    { timestamps: true }
);

offerInvoiceSchemaModel.index({ createdAt: 1 });
module.exports = mongoose.model("OfferInvoice", offerInvoiceSchemaModel);
