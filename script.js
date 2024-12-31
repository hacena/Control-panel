emailjs.init('YOUR_PUBLIC_KEY'); // ضع المفتاح العام هنا

document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); // منع إعادة تحميل الصفحة

  const templateParams = {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value
  };

  emailjs.send(service_0gzc4or', 'template_sh7kooj', templateParams)
    .then(function(response) {
      alert('تم إرسال الرسالة بنجاح!');
      console.log('نجاح:', response.status, response.text);
    }, function(error) {
      alert('حدث خطأ أثناء الإرسال.');
      console.error('خطأ:', error);
    });
});
