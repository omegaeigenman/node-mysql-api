const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from }) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || config.smtpOptions.host,
        port: parseInt(process.env.SMTP_PORT || config.smtpOptions.port, 10),
        secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
        auth: {
            user: process.env.SMTP_USER || config.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || config.smtpOptions.auth.pass
        }
    });

    await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || config.emailFrom,
        to,
        subject,
        html
    });
}