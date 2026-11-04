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

/**
 * Socket.io authentication middleware
 * Expects the client to send { auth: { token: '<JWT>' } } during handshake.
 */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.user = user; // Attach user to socket instance
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  console.log(`🔌 Socket connected: ${socket.id} (user: ${userId})`);

  // Each user joins a personal room identified by their userId
  socket.join(userId);

  /**
   * sendMessage event
   * Payload: { receiverId: String, content: String, expoId?: String }
   */
  socket.on('sendMessage', async (data) => {
    try {
      const { receiverId, content, expoId } = data;

      // Persist the message via the Message model
      const Message = require('./models/Message');
      const message = await Message.create({
        sender: userId,
        receiver: receiverId,
        expo: expoId || null,
        content,
      });

      const populated = await message.populate([
        { path: 'sender', select: 'name avatar' },
        { path: 'receiver', select: 'name avatar' },
      ]);

      // Emit to receiver's personal room
      io.to(receiverId).emit('receiveMessage', populated);

      // Also emit back to sender so their UI updates immediately
      socket.emit('receiveMessage', populated);
    } catch (err) {
      console.error('Socket sendMessage error:', err.message);
      socket.emit('messageError', { error: err.message });
    }
  });

  // Allow clients to explicitly join a room (e.g., an expo chat room)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Allow clients to leave a room
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id} (user: ${userId})`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 EventSphere server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
