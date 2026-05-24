import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // Gmail App Password
    },
});

export type SendMailOptions = {
    to: string;
    subject: string;
    html: string;
};

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
    await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME ?? "Bildirim"}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
};
