<?php
  // Get form data
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  // Validate form data
  if (!$name || !$email || !$message) { 
    die('Please fill out all the fields!');
  }

  // Recipient email address
  $to = 'geektechoffice@gmail.com';

  // Subject
  $subject = 'New Contact Form Submission';

  // Message
  $message = "Name: $name\nEmail: $email\n\n$message";

  // Headers
  $headers = "From: $email" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

  // Send email
  if (mail($to, $subject, $message, $headers)) {
    echo 'OK';
  } else {
    die('Error: Failed to send email');
  }
?>
