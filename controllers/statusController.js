require('dotenv').config()
const nodemailer = require('nodemailer');
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// controller actions
module.exports.status_get = (req, res) => {
  res.render('status');
}

module.exports.status_post = async (req, res) => {
    const { caseid, status, zeki } = req.body;

  console.log('zeki' in req.body)
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  if ('zeki' in req.body) {
    let info = await transporter.sendMail({
      from: `"Ron Walter" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: process.env.EMAIL_SUBJECT,
      text: caseid + " | Status: " + status + " | " + zeki,
      html: caseid + " | Status: " + status + "<br>" + zeki
    })
    console.log("Status übermittelt: %s", info.messageId);
    res.status(200).json({ });
  } else {
    let info = await transporter.sendMail({
      from: `"Ron Walter" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: process.env.EMAIL_SUBJECT,
      text: caseid + " | Status: " + status,
      html: caseid + " | Status: " + status
    })
    console.log("Status übermittelt: %s", info.messageId);
    res.status(200).json({ });
  }  

  
}