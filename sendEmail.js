const nodemailer = require('nodemailer');

// إعدادات البريد الإلكتروني
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // استبدلها ببريدك الإلكتروني
    pass: 'your-email-password'   // استبدلها بكلمة مرورك
  }
});

// إعدادات البريد الإلكتروني الذي ستُرسله
let mailOptions = {
  from: 'your-email@gmail.com',  // من: عنوان البريد
  to: 'recipient-email@example.com', // إلى: عنوان البريد المستلم
  subject: 'رسالة عبر Node.js و Nodemailer', // الموضوع
  text: 'مرحبًا! هذه رسالة تم إرسالها باستخدام Node.js و Nodemailer.' // النص
};

// إرسال البريد الإلكتروني
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log('حدث خطأ: ' + error);
  } else {
    console.log('تم إرسال البريد الإلكتروني: ' + info.response);
  }
});
