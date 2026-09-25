import nodemailer from "nodemailer";

const getSmtpSettings = () => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, FRONTEND_URL } = process.env;
  const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !FRONTEND_URL) {
    return null;
  }
  if (!Number.isInteger(SMTP_PORT) || SMTP_PORT < 1 || SMTP_PORT > 65535) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true" || SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    from: SMTP_FROM,
    frontendUrl: FRONTEND_URL,
  };
};

export const isPasswordResetEmailConfigured = () => Boolean(getSmtpSettings());

export const sendPasswordResetEmail = async (user, token) => {
  const settings = getSmtpSettings();
  if (!settings) throw new Error("SMTP password-reset email settings are incomplete.");

  const transporter = nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: settings.auth,
  });
  const resetUrl = new URL(
    `/forgot?token=${encodeURIComponent(token)}`,
    settings.frontendUrl
  ).toString();

  await transporter.sendMail({
    from: settings.from,
    to: user.email,
    subject: "Reset your Skill Nest password",
    text: [
      `Hello ${user.name || "there"},`,
      "",
      "Use the link below to reset your Skill Nest password. It expires in 30 minutes and can only be used once.",
      resetUrl,
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Hello ${escapeHtml(user.name || "there")},</p>
      <p>Use this link to reset your Skill Nest password. It expires in 30 minutes and can only be used once.</p>
      <p><a href="${escapeHtml(resetUrl)}">Reset my password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);