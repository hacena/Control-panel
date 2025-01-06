<form id="registerForm" method="POST" action="/register">const express = require('express');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// إعداد الاتصال بقاعدة البيانات
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
});

client.connect();

// نموذج التسجيل
app.post('/register', async (req, res) => {
  const { fullName, email, username, password } = req.body;

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  // تخزين المستخدم في قاعدة البيانات
  client.query(
    'INSERT INTO users (full_name, email, username, password) VALUES ($1, $2, $3, $4)',
    [fullName, email, username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'فشل في تسجيل المستخدم' });
      }

      res.json({ message: 'تم التسجيل بنجاح!' });
    }
  );
});
