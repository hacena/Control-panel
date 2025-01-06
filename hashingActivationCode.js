const bcrypt = require('bcrypt');

// تجزئة كود التفعيل باستخدام bcrypt
const code = '12345-67890';
bcrypt.hash(code, 10, (err, hash) => {
  if (err) throw err;
  // الآن يمكن تخزين الـ hash بدلاً من الكود العادي
  console.log("كود التفعيل المجزأ:", hash);
});
