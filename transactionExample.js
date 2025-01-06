const { Client } = require('pg');

// إعداد الاتصال بقاعدة البيانات
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
});

client.connect();

client.query('BEGIN', (err) => {
  if (err) {
    console.log('خطأ في بدء المعاملة:', err);
    return client.end();
  }
  
  // استعلامات إدخال أو تحديث البيانات
  client.query('INSERT INTO activation_codes (code) VALUES ($1)', ['12345-67890'], (err, res) => {
    if (err) {
      console.log('خطأ في إدخال البيانات:', err);
      client.query('ROLLBACK', () => {
        client.end();
      });
    } else {
      client.query('COMMIT', (err) => {
        if (err) {
          console.log('خطأ في إتمام المعاملة:', err);
        }
        client.end();
      });
    }
  });
});
