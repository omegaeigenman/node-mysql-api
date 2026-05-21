import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail(
    { to, subject, html, from }: any
) {
    const smtpOptions = {
        host: process.env.SMTP_HOST || config.smtpOptions.host,
        port: parseInt(process.env.SMTP_PORT || String(config.smtpOptions.port), 10),
        secure: (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
        auth: {
            user: process.env.SMTP_USER || config.smtpOptions.auth.user,
            pass: process.env.SMTP_PASS || config.smtpOptions.auth.pass
        }
    };

    const transporter = nodemailer.createTransport(smtpOptions as any);

    await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || config.emailFrom,
        to,
        subject,
        html
    });
}