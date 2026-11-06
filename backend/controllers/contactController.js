import nodemailer from "nodemailer";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body;
  const cleanedName = typeof name === "string" ? name.trim() : "";
  const cleanedEmail = typeof email === "string" ? email.trim() : "";
  const cleanedMessage = typeof message === "string" ? message.trim() : "";

  if (
    !cleanedName ||
    cleanedName.length > 100 ||
    !isValidEmail(cleanedEmail) ||
    cleanedEmail.length > 254 ||
    !cleanedMessage ||
    cleanedMessage.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid name, email address, and message",
    });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  const port = Number(SMTP_PORT);
  const recipient = SMTP_FROM;
  if (
    !SMTP_HOST ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !SMTP_FROM ||
    !recipient
  ) {
    return res.status(503).json({
      success: false,
      message: "Contact messages are not configured. Please try again later.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: SMTP_FROM,
      to: recipient,
      replyTo: cleanedEmail,
      subject: "GreenCart customer message",
      text: `Name: ${cleanedName}\nEmail: ${cleanedEmail}\n\n${cleanedMessage}`,
    });
    return res
      .status(200)
      .json({ success: true, message: "Your message has been sent" });
  } catch (error) {
    console.error("Unable to send contact message:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send your message right now. Please try again later.",
    });
  }
};
