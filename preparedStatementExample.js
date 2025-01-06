const query = 'INSERT INTO activation_codes (code) VALUES ($1)';
const values = ['12345-67890'];

client.query(query, values, (err, res) => {
  if (err) {
    console.log('خطأ في إدخال البيانات:', err);
  } else {
    console.log('تم إدخال البيانات بنجاح');
  }
});
