<?php
  // Where demo requests are delivered.
  $receiving_email_address = 'support@geektech.software';

  // The message is sent FROM our own domain mailbox, never from the visitor's
  // address: mail claiming to come from gmail.com etc. but sent by this server
  // fails SPF/DMARC and gets rejected or spam-foldered. The visitor's address
  // goes in Reply-To, so hitting "Reply" still answers them.
  $sending_email_address = 'support@geektech.software';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "error";
    exit;
  }

  // Single-line fields go straight into mail headers below. Strip CR/LF
  // (and stray null bytes) so a submitted value can't inject extra
  // headers (e.g. a hidden Bcc:) into the message.
  function clean_header_field($value) {
    $value = str_replace(["\r", "\n", "\0"], '', $value);
    return trim($value);
  }

  $name = isset($_POST['name']) ? clean_header_field($_POST['name']) : '';
  $email = isset($_POST['email']) ? clean_header_field($_POST['email']) : '';
  $subject = isset($_POST['subject']) ? clean_header_field($_POST['subject']) : '';
  $message = isset($_POST['message']) ? trim($_POST['message']) : '';

  if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "error";
    exit;
  }

  $headers = "From: Electrify Website <$sending_email_address>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Encoded so non-English (e.g. Arabic) subjects arrive intact.
  $mail_subject = '=?UTF-8?B?' . base64_encode("[Electrify website] $subject") . '?=';

  $email_body = "Name: $name\n\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";

  // -f sets the envelope sender to the same domain mailbox (SPF alignment).
  if (mail($receiving_email_address, $mail_subject, $email_body, $headers, "-f$sending_email_address")) {
    echo "success";
  } else {
    echo "error";
  }
?>
