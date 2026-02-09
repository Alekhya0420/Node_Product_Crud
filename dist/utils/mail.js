"use strict";
// import nodemailer from "nodemailer";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
// const transporter = nodemailer.createTransport({
//   service:"gmail",
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });
// export const sendMail = async ({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) => {
//   await transporter.sendMail({
//     from: process.env.MAIL_FROM,
//     to:'adminnewone@yopmail.com',
//     subject,
//     html,
//   });
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
const sendMail = async ({ to, subject, html, }) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail.js.map