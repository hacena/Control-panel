const nodemailer = require('nodemailer');

// إعدادات البريد الإلكتروني
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ha2502ha@gmail.com', // بريدك الإلكتروني (استبدله ببريدك الفعلي)
    pass: 'HA2502ha@'           // كلمة مرور البريد (استبدلها بكلمة مرورك الفعلية)
  }
});

// إعدادات البريد الإلكتروني الذي ستُرسله
let mailOptions = {
  from: 'ha2502ha@gmail.com', // من: عنوان البريد (استبدله ببريدك الفعلي)
  to: 'someone@example.com',  // إلى: عنوان البريد المستلم (استبدله بعنوان البريد المستلم)
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
