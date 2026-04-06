const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Order.countDocuments();
        console.log(`Current Order Count: ${count}`);
        const orders = await Order.find().limit(5);
        console.log('Last 5 orders:', JSON.stringify(orders, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
