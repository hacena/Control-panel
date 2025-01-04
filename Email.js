<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>التسجيل</title>
    <style>
        body {
            font-family: 'Cairo', sans-serif;
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f4f4f9;
        }

        .container {
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            width: 400px;
        }

        form {
            display: flex;
            flex-direction: column;
        }

        label {
            margin-top: 10px;
            font-weight: bold;
        }

        input {
            margin-bottom: 15px;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        button {
            margin-top: 10px;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        button:hover {
            background-color: #388E3C;
        }

        .success-message {
            margin-top: 15px;
            color: #2E7D32;
            font-weight: bold;
        }

        .error-message {
            margin-top: 15px;
            color: #D32F2F;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>🔑 التسجيل</h2>
        <form id="registerForm">
            <label for="username">اسم المستخدم:</label>
            <input type="text" id="username" required>

            <label for="email">البريد الإلكتروني:</label>
            <input type="email" id="email" required>

            <label for="password">كلمة المرور:</label>
            <input type="password" id="password" required>

            <button type="submit">تسجيل</button>
        </form>
        <div class="success-message" id="successMessage" style="display:none;">✅ تم إرسال رابط التفعيل إلى بريدك الإلكتروني.</div>
        <div class="error-message" id="errorMessage" style="display:none;">❌ حدث خطأ أثناء التسجيل. حاول مرة أخرى.</div>
    </div>

    <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
    <script>
        (function() {
            emailjs.init("g9DzapSDwZ2_ux_if"); // ✅ App Key
        })();

        document.getElementById('registerForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username && email && password) {
                emailjs.send("service_dpy6jy", "template_sh7koo", {
                    username: username,
                    email: email,
                    password: password
                })
                .then(function(response) {
                    document.getElementById('successMessage').style.display = 'block';
                    setTimeout(() => {
                        window.location.href = 'Login.html';
                    }, 2000);
                }, function(error) {
                    document.getElementById('errorMessage').style.display = 'block';
                });
            } else {
                document.getElementById('errorMessage').innerText = '❌ يرجى ملء جميع الحقول!';
                document.getElementById('errorMessage').style.display = 'block';
            }
        });
    </script>
</body>
</html>
