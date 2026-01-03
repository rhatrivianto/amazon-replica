import { Server } from 'socket.io';

let io;
export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
    // Di Skala Amazon: Tambahkan Redis Adapter di sini agar antar server bisa saling broadcast
  });

  io.on('connection', (socket) => {
    socket.on('join-room', (roomId) => socket.join(roomId));
    console.log(`User connected: ${socket.id}`);
  });
};

export const emitToUser = (userId, event, data) => {
  if (io) io.to(userId).emit(event, data);
};