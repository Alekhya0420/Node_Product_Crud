import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // host: process.env.MAIL_HOST,
  service:"gmail",
  // port: Number(process.env.MAIL_PORT),
  // secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to:'admin@yopmail.com',
    subject,
    html,
  });
};

// import nodemailer from "nodemailer";

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

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,               
    subject,
    html,
  });
};
