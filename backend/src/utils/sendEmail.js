// backend/src/utils/sendEmail.js
import { transporter } from '../lib/mail.js';

const sendEmail = async (options) => {

  const mailOptions = {
    from: '"Rully Store" <noreply@rullystore.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;