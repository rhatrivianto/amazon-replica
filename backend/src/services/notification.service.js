export const sendNotification = async (userId, title, message) => {
  // Skala Amazon: Kirim ke sistem antrian (seperti BullMQ atau RabbitMQ)
  // Di sini versi sederhananya:
  console.log(`Notification queued for ${userId}: ${title}`);
  return { success: true, timestamp: new Date() };
};