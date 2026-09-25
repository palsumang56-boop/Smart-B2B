require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { createClient } = require('redis');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// ==========================================
// 1. REDIS SETUP & EXPORT (Circular Dependency Fix)
// ==========================================
const redisClient = createClient({
  url: process.env.REDIS_URL, // Make sure your .env has rediss:// (double s)
  socket: {
    tls: true, // Prevents SocketClosedUnexpectedlyError
    rejectUnauthorized: false
  }
});

redisClient.on('error', (err) => console.log('Redis Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis Cache successfully.'));

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// CRITICAL FIX: Export redisClient BEFORE importing routes 
// taaki routes ko redisClient defined mile.
module.exports = { redisClient, io: null }; 

// ==========================================
// 2. WEBSOCKET SETUP
// ==========================================
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('User connected via WebSocket');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.set('io', io);
module.exports.io = io; // Optional: agar io bhi baaki files mein chahiye

// ==========================================
// 3. DATABASE SETUP
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Replica Set successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// 4. ROUTES IMPORT
// ==========================================
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const catalogRoutes = require('./routes/catalogRoutes'); 
app.use('/api/products', catalogRoutes);
// ==========================================
// 5. SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;

// Yeh if-condition test files ke saath conflict rokti hai
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`SmartB2B Server running on port ${PORT}`);
  });
}
