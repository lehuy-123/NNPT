const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Product Routes
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', protect, adminOnly, productController.createProduct);
router.put('/products/:id', protect, adminOnly, productController.updateProduct);
router.delete('/products/:id', protect, adminOnly, productController.deleteProduct);

const cartController = require('../controllers/cart.controller');

// Cart Routes
router.get('/carts', protect, cartController.getCart);
router.post('/carts', protect, cartController.addToCart);
router.delete('/carts/:itemId', protect, cartController.removeFromCart);
router.post('/carts/checkout', protect, cartController.checkout);

router.get('/users', protect, adminOnly, (req, res) => res.json({ message: 'User routes' }));
router.get('/categories', (req, res) => res.json({ message: 'Category routes' }));
router.get('/suppliers', (req, res) => res.json({ message: 'Supplier routes' }));
router.get('/inventory', (req, res) => res.json({ message: 'Inventory routes' }));
router.get('/carts', (req, res) => res.json({ message: 'Cart routes' }));
router.get('/vouchers', (req, res) => res.json({ message: 'Voucher routes' }));
router.get('/orders', (req, res) => res.json({ message: 'Order routes' }));
router.get('/reviews', (req, res) => res.json({ message: 'Review routes' }));
router.get('/payments', (req, res) => res.json({ message: 'Payment routes' }));

module.exports = router;
