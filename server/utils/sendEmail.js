import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  if (process.env.DEMO_MODE === 'true' || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Demo mode email skipped:', { to, subject });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
};
