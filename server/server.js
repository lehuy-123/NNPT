const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io); // Lưu vào app để controller có thể gọi

io.on('connection', (socket) => {
    console.log('🔗 Client connected via Socket.io:', socket.id);
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Middlewares
app.use(cors());
app.use(express.json());
// Phục vụ các file upload tĩnh từ thư mục /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const rootRouter = require('./routes/index');
app.use('/api', rootRouter);

app.get('/', (req, res) => {
    res.send('API thiết bị di động đang hoạt động...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy ở môi trường ${process.env.NODE_ENV || 'development'} trên port ${PORT}`);
});
