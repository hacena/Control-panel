const code = '12345-67890';

// التحقق من صحة الكود قبل إدخاله
if (code && code.length > 0) {
  client.query('INSERT INTO activation_codes (code) VALUES ($1)', [code], (err, res) => {
    if (err) {
      console.log('خطأ في إدخال البيانات:', err);
    } else {
      console.log('تم إدخال البيانات بنجاح');
    }
  });
} else {
  console.log('الكود غير صالح');
}
