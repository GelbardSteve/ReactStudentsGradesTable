const { Resend } = require('resend');

// Without an API key (local dev) emails are printed to the console instead of sent
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

// Resend reports API failures as `{ error }` instead of throwing, so turn them into exceptions for callers
const send = async ({ to, subject, html, text }) => {
  if (!resend) {
    console.log(`[mailer] RESEND_API_KEY not set. Email to ${to}: ${subject}\n${text}`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, text });
  if (error) {
    throw new Error(`Resend error (${error.statusCode}): ${error.message}`);
  }
};

const sendVerificationEmail = (to, link) =>
  send({
    to,
    subject: 'Verify your email',
    text: `Click the link to activate your admin account: ${link}\nThe link expires in 24 hours.`,
    html: `<p>Click the link to activate your admin account:</p>
      <p><a href="${escapeHtml(link)}">Verify my email</a></p>
      <p>The link expires in 24 hours.</p>`,
  });

const sendGradesEmail = ({ to, studentName, className, grades }) =>
  send({
    to,
    subject: `Your grades for ${className}`,
    text: `Hi ${studentName},\n\nYour grades for ${className}:\n\n${grades || 'No grades yet'}`,
    html: `<p>Hi ${escapeHtml(studentName)},</p>
      <p>Your grades for <strong>${escapeHtml(className)}</strong>:</p>
      <pre style="font-family: inherit; white-space: pre-wrap;">${escapeHtml(grades || 'No grades yet')}</pre>`,
  });

module.exports = { sendVerificationEmail, sendGradesEmail };
