const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { cacheMiddleware, clearApiCache } = require('./middleware/cache');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Static files (uploaded media) ───────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── Fast In-Memory GET Cache (auto-invalidated on writes) ───────────────────
app.use('/api', cacheMiddleware);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expos', require('./routes/expos'));
app.use('/api/booths', require('./routes/booths'));
app.use('/api/exhibitors', require('./routes/exhibitors'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/feedback', require('./routes/feedback'));

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'EventSphere API is running' })
);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Socket.io Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').lean();
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();

  socket.join(userId);

  socket.on('sendMessage', async (data) => {
    try {
      const { receiverId, content, expoId } = data;

      const Message = require('./models/Message');
      const message = await Message.create({
        sender: userId,
        receiver: receiverId,
        expo: expoId || null,
        content,
      });

      clearApiCache();

      const populated = await message.populate([
        { path: 'sender', select: 'name avatar' },
        { path: 'receiver', select: 'name avatar' },
      ]);

      io.to(receiverId).emit('receiveMessage', populated);
      socket.emit('receiveMessage', populated);
    } catch (err) {
      console.error('Socket sendMessage error:', err.message);
      socket.emit('messageError', { error: err.message });
    }
  });

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 EventSphere server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err?.message || err}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err?.message || err}`);
});
