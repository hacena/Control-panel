const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('mydatabase.db');
app.use(express.json()); // لتفسير البيانات القادمة في هيئة JSON

// API للتحقق من حالة الدفع
app.post('/api/verify-payment', (req, res) => {
    const { userId, amountPaid } = req.body;
    const query = 'SELECT isPaymentConfirmed FROM users WHERE id = ?';
    
    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: '❌ حدث خطأ أثناء التحقق من الدفع' });
        }
        if (!row) {
            return res.status(404).json({ success: false, message: '❌ المستخدم غير موجود' });
        }
        if (row.isPaymentConfirmed) {
            res.json({ success: true, message: '✅ تم تأكيد الدفع' });
        } else {
            res.status(400).json({ success: false, message: '❌ لم يتم تأكيد الدفع' });
        }
    });
});

// API لاسترجاع الرسائل
app.get('/api/messages', (req, res) => {
    const query = 'SELECT * FROM messages ORDER BY createdAt DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: '❌ فشل في جلب الرسائل' });
        }
        res.json(rows);
    });
});

// API لإرسال رسالة جديدة
app.post('/api/messages', (req, res) => {
    const { sender, receiver, message } = req.body;
    const query = 'INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)';
    
    db.run(query, [sender, receiver, message], function (err) {
        if (err) {
            return res.status(500).json({ success: false, message: '❌ فشل في إرسال الرسالة' });
        }
        res.json({ success: true, message: '✅ تم إرسال الرسالة بنجاح' });
    });
});

// إعداد الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على البورت ${PORT}`);
});
