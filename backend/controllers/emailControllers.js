const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email, subject, message, emails } = req.body;
  console.log("Hi rushi",email, subject, message, emails);

  // var mailOptions = {
  //   from: process.env.SMTP_MAIL,
  //   to: email,
  //   subject: subject,
  //   text: message,
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email sent successfully!");
  //   }
  // });
  const recipientEmails = emails.slice(1);

  // Assuming you want to send emails to each recipient in the array
  recipientEmails.forEach((recipient) => {
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: recipient,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(`Error sending email to ${recipient}:`, error);
      } else {
        console.log(`Email sent successfully to ${recipient}!`);
      }
    });
  });
});

module.exports = { sendEmail };
