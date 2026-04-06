const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    variants: [{
        name: String,
        additionalPrice: Number,
        label: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
