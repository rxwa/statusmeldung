require('dotenv').config()
const Status = require("../models/Status");
const nodemailer = require('nodemailer');
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// controller actions
module.exports.status_get = (req, res) => {
  res.render('status');
}


module.exports.status_post = async (req, res) => {
  
  // Get phone number and company
  const getUserData = await User.find()
  const username = getUserData[0].name
  const surname = getUserData[0].surname
  const phone = getUserData[0].phone
  const company = getUserData[0].company
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
          text: `${caseid} | Status: ${status}\n
                 ZEK: ${zeki}
                 \n\n
                 Crewkontakt: ${phone}\n
                 Status übermittelt von ${username} ${surname}, ${company}`,
          html: `<b>${caseid}</b> | Status: <b>${status}</b><br>
                 <b>ZEK</b>: ${zeki}
                 <br><br>
                 <span style="font-size: 11px;">Crewkontakt: ${phone}</span><br>
                 <span style="font-size: 11px;">Status übermittelt von ${username} ${surname}, ${company}</span>`
        })
      } else {
        let info = await transporter.sendMail({
          from: `"Ron Walter" <${process.env.EMAIL_FROM}>`,
          to: process.env.EMAIL_TO,
          subject: process.env.EMAIL_SUBJECT,
          text: `${caseid} | Status: ${status}
                 \n\n
                 Crewkontakt: ${phone}\n
                 Status übermittelt von ${username} ${surname}, ${company}`,
          html: `<b>${caseid}</b> | Status: <b>${status}</b>
                 <br><br>
                 <span style="font-size: 11px;">Crewkontakt: ${phone}</span><br>
                 <span style="font-size: 11px;">Status übermittelt von ${username} ${surname}, ${company}</span>`
        })
      }
    // console.log("Status übermittelt: %s", info.messageId);
    
    try{ 
     const user = await Status.create({ caseid, stati: status, zek: zeki, name: username, surname, phone, company });
    }
    catch(err) {
      res.status(400).json({ err });
    }
    res.status(200).json({ });
  }  