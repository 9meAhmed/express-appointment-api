import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, SENDER_EMAIL, REPLY_TO } =
  process.env;

let configOptions = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
};

export default class Mailer {
  static async sendMail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport(configOptions);
    const mailOptions = {
      from: SENDER_EMAIL,
      to,
      subject,
      text, // plain text body
      replyTo: REPLY_TO,
    };
    return transporter.sendMail(mailOptions);
  }
}
