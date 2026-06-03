import asyncHandler from 'express-async-handler';
import { sendEmail } from '../utils/sendEmail.js';
import { submitContact as saveContactDemo } from '../data/demoStore.js';

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // If running in demo mode or email is not configured, save the message to demo store
  if (process.env.DEMO_MODE === 'true' || !process.env.EMAIL_USER) {
    try {
      saveContactDemo({ name, email, phone, message });
    } catch (err) {
      // ignore demo store failures but return success to the client
      console.warn('Failed to save contact to demo store', err);
    }
    return res.status(201).json({ message: 'Message received (demo mode)' });
  }

  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `New contact message from ${name}`,
    text: `${name} (${email}, ${phone}) says: ${message}`,
    html: `<p><strong>${name}</strong> (${email}, ${phone}) wrote:</p><p>${message}</p>`,
  });

  res.status(201).json({ message: 'Message sent successfully' });
});
