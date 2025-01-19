const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST, // Mailtrap host
    port: process.env.MAILTRAP_PORT, // Mailtrap port
    auth: {
      user: process.env.MAILTRAP_USER, // Mailtrap username
      pass: process.env.MAILTRAP_PASS, // Mailtrap password
    },
  });

  const mailOptions = {
    from: process.env.MAILTRAP_FROM, // Mailtrap from,
    to,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;