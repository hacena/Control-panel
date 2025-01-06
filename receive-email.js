const Imap = require('imap');
const inspect = require('util').inspect;

const imap = new Imap({
    user: 'your-email@gmail.com',  // استبدلها ببريدك الإلكتروني
    password: 'your-email-password',  // استبدلها بكلمة مرور بريدك
    host: 'imap.gmail.com',
    port: 993,
    tls: true
});

imap.once('ready', function() {
    imap.openBox('INBOX', true, function(err, box) {
        if (err) throw err;

        // الحصول على آخر 10 رسائل
        const fetch = imap.fetch(box.messages.total - 9, { // تعدل حسب الحاجة
            bodies: '',
            struct: true
        });

        fetch.on('message', function(msg, seqno) {
            console.log('رسالة جديدة: ' + seqno);
            msg.on('body', function(stream, info) {
                let buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString();
                });
                stream.once('end', function() {
                    console.log('محتوى الرسالة: ' + buffer);
                });
            });
        });

        fetch.once('end', function() {
            console.log('تم الانتهاء من جلب الرسائل');
            imap.end();
        });
    });
});

imap.once('error', function(err) {
    console.log(err);
});

imap.once('end', function() {
    console.log('تم إغلاق الاتصال');
});

imap.connect();
