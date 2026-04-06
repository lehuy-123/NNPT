const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// Routes
const rootRouter = require('./routes/index');
app.use('/api', rootRouter);

app.get('/', (req, res) => {
    res.send('API thiết bị di động đang hoạt động...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy ở môi trường ${process.env.NODE_ENV || 'development'} trên port ${PORT}`);
});
