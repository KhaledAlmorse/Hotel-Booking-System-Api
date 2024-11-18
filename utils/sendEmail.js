const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1-create transporter(service that will send email like "gmail")
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, //if secure false port=587
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2-Define email options (like from,to,subject,email content)
  const mailOpts = {
    from: "F-Hotel<khaledmanea0077@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //6-send email
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
