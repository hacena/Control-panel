const express = require('express');const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد وسطيات Express للتعامل مع JSON و URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعداد Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // يمكنك اختيار خدمة بريد إلكتروني أخرى
  auth: {
    user: 'your-email@gmail.com',  // بريدك الإلكتروني
    pass: 'your-email-password'  // كلمة المرور للبريد الإلكتروني
  }
});

// نقطة النهاية للتسجيل
app.post('/register', (req, res) => {
  const { email, username } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',  // البريد الذي سيتم الإرسال منه
    to: email,  // البريد الذي سيتم إرسال الرسالة إليه
    subject: 'Welcome to MyApp!',
    text: `Hello ${username},\n\nThank you for registering with us!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email: ' + error.message);
    }
    res.status(200).send('Registration successful! A confirmation email has been sent.');
  });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
