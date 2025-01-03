const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());

// ✅ إنشاء قاعدة بيانات SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ فشل الاتصال بقاعدة البيانات SQLite:', err);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات SQLite');
    }
});

// ✅ إنشاء الجدول إذا لم يكن موجودًا
db.run(`
    CREATE TABLE IF NOT EXISTS activation_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL UNIQUE,
        userId TEXT,
        activated BOOLEAN DEFAULT 0,
        isPaymentConfirmed BOOLEAN DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// ✅ API لتفعيل الكود
app.post('/api/activate', async (req, res) => {
    const { code, userId } = req.body;

    try {
        db.get('SELECT * FROM activation_codes WHERE code = ?', [code], (err, row) => {
            if (err) {
                return res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
            }

            if (!row) {
                return res.status(400).json({ success: false, message: '❌ كود غير صحيح' });
            }

            if (row.activated) {
                return res.status(400).json({ success: false, message: '❌ الكود مستخدم بالفعل' });
            }

            if (row.userId && row.userId !== userId) {
                return res.status(400).json({ success: false, message: '❌ الكود مرتبط بحساب آخر' });
            }

            if (!row.isPaymentConfirmed) {
                return res.status(400).json({ success: false, message: '❌ لم يتم تأكيد الدفع بعد' });
            }

            // ✅ تحديث حالة التفعيل
            db.run('UPDATE activation_codes SET userId = ?, activated = 1 WHERE code = ?', [userId, code], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: '❌ حدث خطأ في التفعيل' });
                }
                res.json({ success: true, message: '✅ تم تفعيل الكود بنجاح' });
            });
        });
    } catch (error) {
        console.error('❌ Error during code activation:', error);
        res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
    }
});

// ✅ API للتحقق من حالة الدفع
app.post('/api/verify-payment', async (req, res) => {
    const { transactionId, amountPaid, paymentDate, userId } = req.body;

    try {
        // ⚠️ إضافة منطق التحقق من الدفع حسب نظامك
        const paymentConfirmed = true; // مثال: يُفترض أن الدفع تم بنجاح

        if (paymentConfirmed) {
            db.run('UPDATE activation_codes SET isPaymentConfirmed = 1 WHERE userId = ?', [userId], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: '❌ حدث خطأ في التحقق من الدفع' });
                }
                res.json({ success: true, message: '✅ تم تأكيد الدفع بنجاح' });
            });
        } else {
            res.status(400).json({ success: false, message: '❌ لم يتم تأكيد الدفع' });
        }

    } catch (error) {
        console.error('❌ Error during payment verification:', error);
        res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
    }
});

// ✅ مسار للتحقق من صحة الخادم
app.get('/', (req, res) => {
    res.send('🚀 Server is running successfully!');
});

// ✅ بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
