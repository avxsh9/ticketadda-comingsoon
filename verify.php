<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $secret = "6LdTGdErAAAAAOmu8Nzt7csWSrdbXK8-R9oatTbR"; // Secret key
    $response = $_POST['g-recaptcha-response'] ?? '';
    $email = htmlspecialchars($_POST['email']);
    $remoteip = $_SERVER['REMOTE_ADDR'];

    $verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$response}&remoteip={$remoteip}");
    $captcha_success = json_decode($verify);

    if ($captcha_success->success) {
        // Captcha passed
        echo "Captcha Passed! Form submitted successfully for $email";
    } else {
        echo "Captcha Failed!";
    }
} else {
    echo "Invalid request method.";
}
?>
