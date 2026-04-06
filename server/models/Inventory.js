const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['import', 'export'], required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number },
    note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
