const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// إنشاء تطبيق Express
const app = express();

// إعداد استخدام ملفات static
app.use(express.static(path.join(__dirname, 'public')));

// إعداد الـ JSON
app.use(express.json());

// إنشاء قاعدة بيانات SQLite
const db = new sqlite3.Database('mydb.db', (err) => {
    if (err) {
        console.error('❌ حدث خطأ في الاتصال بقاعدة البيانات:', err);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    }
});

// صفحة الواجهة الرئيسية (Home)
app.get('/', (req, res) => {
    res.send('<h1>مرحبًا بكم في تطبيق Node.js مع Express و SQLite</h1>');
});

// صفحة التأكيد
app.post('/api/verify-payment', (req, res) => {
    const { transactionId, amountPaid, paymentDate, userId } = req.body;

    // منطق التحقق من الدفع
    if (transactionId && amountPaid) {
        // تحديث الحالة في قاعدة البيانات
        db.run(`UPDATE payments SET status = 'confirmed' WHERE transactionId = ?`, [transactionId], (err) => {
            if (err) {
                res.status(500).json({ success: false, message: '❌ حدث خطأ في قاعدة البيانات' });
            } else {
                res.status(200).json({ success: true, message: '✅ تم تأكيد الدفع بنجاح' });
            }
        });
    } else {
        res.status(400).json({ success: false, message: '❌ البيانات غير مكتملة' });
    }
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
