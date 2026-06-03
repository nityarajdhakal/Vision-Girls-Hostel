import asyncHandler from 'express-async-handler';
import { sendEmail } from '../utils/sendEmail.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New contact message from ${name}`,
    text: `${name} (${email}, ${phone}) says: ${message}`,
    html: `<p><strong>${name}</strong> (${email}, ${phone}) wrote:</p><p>${message}</p>`,
  });

  res.status(201).json({ message: 'Message sent successfully' });
});
