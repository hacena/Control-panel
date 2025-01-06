const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { Client } = require('pg'); // قاعدة البيانات PostgreSQL

const app = express();
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'your-username', // اسم المستخدم الذي اخترته أثناء التثبيت
  password: 'your-password', // كلمة المرور التي اخترتها
  database: 'your-database-name', // اسم القاعدة التي أنشأتها
});
client.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعداد خدمة البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'gmail', // يمكن استخدام أي خدمة بريد إلكتروني
  auth: {
    user: 'your-email@gmail.com', // بريدك الإلكتروني
    pass: 'your-email-password',   // كلمة مرور بريدك الإلكتروني
  },
});

// دالة لإرسال البريد الإلكتروني
function sendEmail(userEmail, userName, userUsername, userPassword) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'تم تسجيلك بنجاح في الموقع!',
    html: `
      <p>مرحبًا ${userName},</p>
      <p>لقد تم تسجيلك بنجاح في الموقع.</p>
      <p>اسم المستخدم: ${userUsername}</p>
      <p>كلمة المرور: ${userPassword}</p>
      <p>للدخول إلى حسابك، اضغط على الرابط التالي:
      <a href="http://localhost:3000/login?username=${userUsername}&password=${userPassword}">تسجيل الدخول</a></p>
      <p>بعد تسجيل الدخول، ستتمكن من الانتقال إلى صفحة البيع.</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('خطأ في إرسال البريد الإلكتروني:', err);
    } else {
      console.log('تم إرسال البريد الإلكتروني:', info.response);
    }
  });
}

// دالة لتسجيل المستخدم
app.post('/register', async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // تحقق من وجود بيانات المستخدم في قاعدة البيانات
  const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
  if (existingUser.rows.length > 0) {
    return res.status(400).json({ error: 'اسم المستخدم موجود بالفعل' });
  }

  // تشفير كلمة المرور قبل حفظها في قاعدة البيانات
  const hashedPassword = await bcrypt.hash(password, 10);

  // إضافة المستخدم إلى قاعدة البيانات
  client.query(
    'INSERT INTO users (full_name, email, username, password) VALUES ($1, $2, $3, $4)',
    [fullName, email, username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'فشل في تسجيل المستخدم' });
      }

      // إرسال البريد الإلكتروني بعد التسجيل
      sendEmail(email, fullName, username, password);

      res.json({ message: 'تم التسجيل بنجاح!' });
    }
  );
});

// تشغيل الخادم
app.listen(3000, () => {
  console.log('الخادم يعمل على http://localhost:3000');
});
