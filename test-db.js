const sqlite3 = require('sqlite3').verbose();

// إنشاء اتصال بقاعدة البيانات SQLite
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    }
});

// اختبار إنشاء جدول
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`, (err) => {
    if (err) {
        console.error('❌ خطأ في إنشاء الجدول:', err.message);
    } else {
        console.log('✅ تم إنشاء الجدول بنجاح');
    }
});

// إغلاق الاتصال
db.close((err) => {
    if (err) {
        console.error('❌ خطأ في إغلاق قاعدة البيانات:', err.message);
    } else {
        console.log('✅ تم إغلاق قاعدة البيانات بنجاح');
    }
});const nodemailer = require('nodemailer');

// إعدادات البريد الإلكتروني
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',  // استبدلها بعنوان بريدك الإلكتروني
        pass: 'your-email-password'   // استبدلها بكلمة مرور بريدك
    }
});

// إعدادات الرسالة
let mailOptions = {
    from: 'your-email@gmail.com',  // استبدلها بعنوان بريدك
    to: 'recipient-email@example.com',  // استبدلها بالبريد المستلم
    subject: 'Test Email',  // الموضوع
    text: 'This is a test email.'  // نص الرسالة
};

// إرسال البريد الإلكتروني
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log('حدث خطأ: ' + error);
    } else {
        console.log('تم إرسال البريد الإلكتروني: ' + info.response);
    }
});

