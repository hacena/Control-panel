<?php
// الاتصال بقاعدة البيانات
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "payment_db";

$conn = new mysqli($servername, $username, $password, $dbname);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// استقبال بيانات طرق الدفع
$paypal_link = $_POST['paypal_link'];
$wise_link = $_POST['wise_link'];
$payeer_link = $_POST['payeer_link'];
$ccp_name = $_POST['ccp_name'];
$ccp_account = $_POST['ccp_account'];
$ccp_amount = $_POST['ccp_amount'];

// استقبال ملف وصل الدفع
$target_dir = "uploads/";
$ccp_receipt = $target_dir . basename($_FILES["ccp_receipt"]["name"]);
move_uploaded_file($_FILES["ccp_receipt"]["tmp_name"], $ccp_receipt);

// إدخال البيانات في قاعدة البيانات
$sql = "INSERT INTO payment_links (paypal_link, wise_link, payeer_link, ccp_name, ccp_account, ccp_amount, ccp_receipt)
VALUES ('$paypal_link', '$wise_link', '$payeer_link', '$ccp_name', '$ccp_account', '$ccp_amount', '$ccp_receipt')";

if ($conn->query($sql) === TRUE) {
    echo "تم حفظ طرق الدفع بنجاح!";
} else {
    echo "خطأ: " . $conn->error;
}

$conn->close();
?>
