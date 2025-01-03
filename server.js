const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config({ path: './config.env' });

const app = express();
app.use(express.json());

// ✅ الاتصال بقاعدة بيانات MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch((error) => {
    console.error('❌ MongoDB Connection Error:', error);
});

// ✅ تعريف نموذج الكودات
const activationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    userId: { type: String, required: false },
    activated: { type: Boolean, default: false },
    isPaymentConfirmed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now } // تاريخ إنشاء الكود
});

const ActivationCode = mongoose.model('ActivationCode', activationCodeSchema);

/// ✅ Middleware للتحقق من المدخلات
const validateRequest = (fields) => {
    return (req, res, next) => {
        for (let field of fields) {
            if (!req.body[field]) {
                return res.status(400).json({ success: false, message: `❌ الحقل ${field} مطلوب` });
            }
        }
        next();
    };
};

// ✅ API لتفعيل الكود
app.post('/api/activate', validateRequest(['code', 'userId']), async (req, res) => {
    const { code, userId } = req.body;

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

        // ✅ تحقق من حالة الدفع قبل التفعيل
        if (!activation.isPaymentConfirmed) {
            return res.status(400).json({ success: false, message: '❌ لم يتم تأكيد الدفع بعد' });
        }

        // ✅ تحديث حالة التفعيل
        activation.userId = userId;
        activation.activated = true;
        await activation.save();

        res.json({ success: true, message: '✅ تم تفعيل الكود بنجاح' });

    } catch (error) {
        console.error('❌ Error during code activation:', error);
        res.status(500).json({ success: false, message: '❌ حدث خطأ في الخادم' });
    }
});

// ✅ API للتحقق من حالة الدفع
app.post('/api/verify-payment', validateRequest(['transactionId', 'amountPaid', 'paymentDate', 'userId']), async (req, res) => {
    const { transactionId, amountPaid, paymentDate, userId } = req.body;

    try {
        // ⚠️ إضافة منطق التحقق من الدفع حسب نظامك
        const paymentConfirmed = true; // مثال: يُفترض أن الدفع تم بنجاح

        if (paymentConfirmed) {
            await ActivationCode.updateOne(
                { userId: userId }, 
                { $set: { isPaymentConfirmed: true } }
            );

            res.json({ success: true, message: '✅ تم تأكيد الدفع بنجاح' });
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
