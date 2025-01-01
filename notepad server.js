const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/activate', (req, res) => {
    const { code, userId } = req.body;

    if (code === 'VALID-CODE') {
        res.json({ success: true, message: 'تم تفعيل التطبيق بنجاح!' });
    } else {
        res.json({ success: false, message: 'كود التفعيل غير صحيح.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
