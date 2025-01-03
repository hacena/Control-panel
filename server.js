const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// الاتصال بقاعدة بيانات MongoDB (افترض أنك قد قمت بتكوين MongoDB)
mongoose.connect('mongodb://localhost:27017/activationCodesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});

// تعريف نموذج الكودات
const activationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true },
    userId: { type: String, required: false },
    activated: { type: Boolean, default: false },
    isPaymentConfirmed: { type: Boolean, default: false }  // حقل جديد للتحقق من حالة الدفع
});

const ActivationCode = mongoose.model('ActivationCode', activationCodeSchema);

// API لتفعيل الكود
app.post('/api/activate', async (req, res) => {
    const { code, userId } = req.body;

    // التحقق من المدخلات
    if (!code || !userId) {
        return res.status(400).json({ success: false, message: '❌ الكود و معرف المستخدم مطلوبان' });
    }

    // البحث عن الكود في قاعدة البيانات
    try {
        const activation = await ActivationCode.findOne({ code });

        if (!activation) {
            return res.status(400).json({ success: false, message: '❌ كود غير صحيح' });
        }

        if (activation.activated) {
            return res.status(400).json({ success: false, message: '❌ الكود مستخدم بالفعل' });
        }

        if (activation.userId && activation.userId !== userId) {
            return res.status(400).json({ success: false, message: '❌ الكود مرتبط بحساب آخر' });
        }

        // تحديث الكود ليكون مفعّل
        activation.userId = userId; // ربط الكود بالمستخدم
        activation.activated = true; // تغيير الحالة إلى مفعّل

        await activation.save(); // حفظ التعديلات في قاعدة البيانات

        res.json({ success: true, message: '✅ تم تفعيل الكود بنجاح' });

    } catch (error) {
        console.error('Error during code activation:', error);
        res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
    }
});

// API للتحقق من حالة الدفع
app.post('/verify-payment', async (req, res) => {
    const { transactionId, amountPaid, paymentDate, userId } = req.body;

    if (!transactionId || !amountPaid || !paymentDate || !userId) {
        return res.status(400).json({ success: false, message: '❌ جميع الحقول مطلوبة' });
    }

    try {
        // يمكنك إضافة منطق للتحقق من الدفع في قاعدة البيانات
        // في هذا المثال، نفترض أن الدفع تم تأكيده بنجاح
        const paymentConfirmed = true; // استبدل هذا بالمنطق الفعلي للتحقق من الدفع

        if (paymentConfirmed) {
            // تحديث حالة الدفع في قاعدة البيانات
            await ActivationCode.updateOne(
                { userId: userId }, 
                { $set: { isPaymentConfirmed: true } }
            );

            res.json({ success: true, message: '✅ تم تأكيد الدفع بنجاح' });
        } else {
            res.json({ success: false, message: '❌ لم يتم تأكيد الدفع' });
        }

    } catch (error) {
        console.error('Error during payment verification:', error);
        res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
    }
});

// بدء الخادم
app.listen(3000, () => console.log('Server running on port 3000'));
