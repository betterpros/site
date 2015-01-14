<?php
/**
 * form 2 mail for bickel.dental
 *
 * @author  Lucas Bickel <hairmare@purplehaze.ch>
 * @licence AGPL
 */

require __DIR__.'/vendor/autoload.php';

$config = \Noodlehaus\Config::load(__DIR__ . '/config.json');

$mail = new PHPMailer;

if ($config['debug']) {
    $mail->SMTPDebug = 3;
    $mail->Debugoutput = 'html';
}

$mail->isSMTP();
$mail->Host = $config['mail']['host'];
$mail->Port = $config['mail']['port'];
$mail->From = $config['mail']['from']['mail'];
$mail->FromName = $config['mail']['from']['name'];

$mail->SMTPAuth = true;
$mail->AuthType = 'PLAIN';
$mail->Username = $config['mail']['auth']['username'];
$mail->Password = $config['mail']['auth']['password'];

$mail->addAddress($config['mail']['to']['mail'], $config['mail']['to']['name']);

if (PHPMailer::ValidateAddress($_POST['email'])) {

    $mail->AddReplyTo($_POST['email']);
    $mail->Subject = $_POST['subject'];
    $mail->Body = $_POST['message'];

    if(!$mail->send()) {
        header('Location: mail_error.html?error='.urlencode($mail->ErrorInfo));
    } else {
        header("Location: mail_success.html");
    }
} else {
    header("Location: mail_error.html?error=Invalid%20mail");
}
