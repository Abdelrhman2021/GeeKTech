<?php
  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'support@geektech.software';

  $name = $_POST['name'];
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];

  $headers = "From: $name <$email>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  $email_body = "Name: $name\n\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";

 
?>
