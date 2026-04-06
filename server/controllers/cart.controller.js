const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, variantName, price } = req.body;
        
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = new Cart({ user: req.user._id, items: [] });

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId && p.variantName === variantName);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity, price, variantName });
        }
        
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        let cart = await Cart.findOne({ user: req.user._id });
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const Order = require('../models/Order');

exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

        const tax = cart.totalPrice * 0.08;
        const finalAmount = cart.totalPrice + tax;

        const order = new Order({
            user: req.user._id,
            items: cart.items.map(i => ({ product: i.product, quantity: i.quantity, price: i.price, variantName: i.variantName })),
            totalAmount: finalAmount,
            paymentMethod: 'QR_Bank',
            shippingAddress: 'Online Transfer'
        });

        await order.save();
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.json({ message: 'Order successful', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
