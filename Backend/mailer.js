// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// module.exports = transporter;


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "hala.abushiihab@gmail.com",
//     pass: "ivefxmmmajainuqo",
//   },
// });

// mailer.js

// Backend/utils/mailer.js
// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // أو استخدم host و port لو مش Gmail
  auth: {
    user: 'hala.abushiihab@gmail.com',
    pass: 'ivefxmmmajainuqo', // استخدم app password، مو الباسورد العادي
  },
});

module.exports = transporter;
