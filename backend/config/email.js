import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (toEmail, resetUrl) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("[email] EMAIL_* env vars not set — reset link would go to:", toEmail, resetUrl);
    return;
  }
  await transporter.sendMail({
    from: `"GIGO Food" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your GIGO Food password",
    html: `<p>You requested a password reset.</p>
           <p><a href="${resetUrl}">Click here to reset your password</a> (expires in 1 hour).</p>
           <p>If you didn't request this, you can ignore this email.</p>`,
  });
};
