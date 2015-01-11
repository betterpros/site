<?php
/**
 * form 2 mail for bickel.dental
 *
 * @author  Lucas Bickel <hairmare@purplehaze.ch>
 * @licence AGPL
 */

require __DIR__.'/vendor/autoload.php';

$config = \Noodlehaus\Config::load(__DIR__ . '/../config.json');

$mail = new PHPMailer;

if ($config['debug']) {
    $mail->SMTPDebug = 3;
    $mail->Debugoutput = 'html';
}

$mail->isSMTP();
$mail->Host = $config['mail']['host'];
#$mail->SMTPAuth = true;
$mail->Port = $config['mail']['port'];
$mail->From = $config['mail']['from']['mail'];
$mail->FromName = $config['mail']['from']['name'];

$mail->SMTPAuth = true;
$mail->AuthType = 'PLAIN';
$mail->Username = $config['mail']['auth']['username'];
$mail->Password = $config['mail']['auth']['password'];

$mail->addAddress($config['mail']['to']['mail'], $config['mail']['to']['name']);

$mail->Subject = 'Mail from betterpros.com.au';
$mail->Body = 'This is a test mail';

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}
