<?php
  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'support@geektech.software';

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

  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  $email_body = "Name: $name\n\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";

  if (mail($receiving_email_address, $subject, $email_body, $headers)) {
    echo "success";
  } else {
    echo "error";
  }
?>
