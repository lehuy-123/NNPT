const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query; // e.g. "smartphones"
        let filter = {};

        if (category) {
            const catDoc = await Category.findOne({ slug: category });
            if (catDoc) {
                filter.category = catDoc._id;
            } else {
                return res.json([]); // Return empty array if category doesn't exist yet
            }
        }

        const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, categorySlug, image } = req.body;
        
        // Find or auto-create category based on slug
        let catDoc = await Category.findOne({ slug: categorySlug });
        if (!catDoc) {
            catDoc = await Category.create({ 
                name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1), 
                slug: categorySlug 
            });
        }

        const newProduct = new Product({
            name,
            description,
            price: Number(price),
            category: catDoc._id,
            images: [image || '/images/phone.png'],
            stock: 100,
            variants: req.body.variants || []
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
