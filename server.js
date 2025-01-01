const express = require('express');
const app = express();
app.use(express.json());  // لتحليل JSON في body الطلبات

// قاعدة بيانات وهمية لتخزين الأكواد
let activationCodes = [
    { code: 'ABC123', userId: null, activated: false }
];

// API لتفعيل الكود
app.post('/api/activate', (req, res) => {
    const { code, userId } = req.body;

    const activation = activationCodes.find(c => c.code === code);

    if (!activation) {
        return res.status(400).json({ success: false, message: '❌ كود غير صحيح' });
    }

    if (activation.activated) {
        return res.status(400).json({ success: false, message: '❌ الكود مستخدم بالفعل' });
    }

    if (activation.userId && activation.userId !== userId) {
        return res.status(400).json({ success: false, message: '❌ الكود مرتبط بحساب آخر' });
    }

    activation.userId = userId; // ربط الكود بالمستخدم
    activation.activated = true; // تغيير الحالة إلى مفعّل

    res.json({ success: true, message: '✅ تم تفعيل الكود بنجاح' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
