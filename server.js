const express = require('express');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// إعداد Express
app.use(bodyParser.json());
app.use(cors());

// إعداد مفتاح Brevo API
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'YOUR_BREVO_API_KEY'; // استبدل بمفتاحك

// نقطة نهاية لإرسال البريد
app.post('/send-email', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: '❌ البريد الإلكتروني مطلوب' });
    }

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = { name: 'اسم التطبيق', email: 'your_verified_sender@email.com' };
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.subject = 'تفعيل حسابك';
    sendSmtpEmail.htmlContent = `
        <h1>🔑 أهلاً بك!</h1>
        <p>تم إنشاء حسابك بنجاح. انقر على الرابط أدناه لتفعيل حسابك:</p>
        <a href="https://yourdomain.com/activate.html">تفعيل الحساب</a>
    `;

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('Email sent:', data);
        res.status(200).json({ message: '✅ تم إرسال البريد الإلكتروني بنجاح!' });
    }).catch(function(error) {
        console.error('Error:', error);
        res.status(500).json({ message: '❌ فشل في إرسال البريد الإلكتروني.' });
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
