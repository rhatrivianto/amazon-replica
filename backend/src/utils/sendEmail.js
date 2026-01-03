import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Rully Store" <noreply@rullystore.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);


};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    // Cari user berdasarkan token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau kadaluarsa.' });
    }

    // Update status user
    user.isVerified = true;
    user.verificationToken = undefined; // Hapus token setelah dipakai
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email berhasil diverifikasi! Silakan login di aplikasi.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default sendEmail;