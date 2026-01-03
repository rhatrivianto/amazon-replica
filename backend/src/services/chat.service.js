// =========================================================
// 📄 src/services/chat.service.js
// =========================================================
import { Chat, Message }  from '../models/chat.model.js';

const accessOrCreateChat = async (userId, otherUserId) => {
  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [userId, otherUserId] }
  }).populate('users', '-password');

  if (!chat) {
    chat = await Chat.create({ users: [userId, otherUserId], isGroupChat: false });
  }
  return chat;
};

const sendMessage = async (senderId, chatId, content) => {
  let message = await Message.create({ sender: senderId, content: content, chat: chatId });
  message = await message.populate('sender', 'name');
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  return message;
};

// ... fungsi lain seperti getAllUserChats, dll.

export { accessOrCreateChat, sendMessage };