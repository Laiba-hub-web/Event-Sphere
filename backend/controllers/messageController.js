const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

// ─── @route   POST /api/messages ─────────────────────────────────────────────
// ─── @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiver, receiverId, content, expoId, expo } = req.body;
    const targetReceiver = receiver || receiverId;

    if (!targetReceiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver and content are required',
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: targetReceiver,
      expo: expo || expoId || null,
      content,
    });

    const populated = await message.populate([
      { path: 'sender', select: 'name email avatar role' },
      { path: 'receiver', select: 'name email avatar role' },
    ]);

    res.status(201).json({ success: true, message: populated });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/messages/conversations ────────────────────────────────
// ─── @access  Private
const getConversations = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Find all messages involving the current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.sender._id.toString() === userId.toString();
      const partner = isSender ? msg.receiver : msg.sender;
      if (!partner) return;
      const partnerId = partner._id.toString();

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      if (!isSender && !msg.read) {
        conversationsMap.get(partnerId).unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   GET /api/messages/thread/:userId ───────────────────────────────
// ─── @access  Private
const getThread = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role')
      .sort({ createdAt: 1 });

    // Mark received unread messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    next(err);
  }
};

// ─── @route   PUT /api/messages/read/:userId ─────────────────────────────────
// ─── @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getThread,
  markAsRead,
};

