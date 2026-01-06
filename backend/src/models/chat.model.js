// src/models/chat.model.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    room: { type: String, index: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
}, { timestamps: true });

// EKSPOR DENGAN NAMED EXPORT (Agar cocok dengan Service kamu)
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default { Chat, Message };