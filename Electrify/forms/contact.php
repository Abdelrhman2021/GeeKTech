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

  // Spam trap: real visitors never see or fill this field. Bots do, so
  // report success and send nothing.
  if (!empty($_POST['website'])) {
    echo "success";
    exit;
  }

  function field($key) {
    return isset($_POST[$key]) ? clean_header_field($_POST[$key]) : '';
  }

  $name = field('name');
  $email = field('email');
  $company = field('company');
  $job_title = field('job_title');
  $destination_type = field('destination_type');
  $fleet_size = field('fleet_size');
  $timeline = field('timeline');
  $message = isset($_POST['message']) ? trim($_POST['message']) : '';

  if ($name === '' || $company === '' || $destination_type === '' || $fleet_size === ''
      || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "error";
    exit;
  }

  $subject = "Demo request: $company ($name)";

  $headers = "From: Electrify Website <$sending_email_address>\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

  // Encoded so non-English (e.g. Arabic) subjects arrive intact.
  $mail_subject = '=?UTF-8?B?' . base64_encode("[Electrify website] $subject") . '?=';

  $email_body = "Name: $name\n"
    . "Email: $email\n"
    . "Company / destination: $company\n"
    . "Job title: " . ($job_title !== '' ? $job_title : '-') . "\n"
    . "Type of destination: $destination_type\n"
    . "Current fleet size: $fleet_size\n"
    . "Expected timeline: " . ($timeline !== '' ? $timeline : '-') . "\n\n"
    . "Their mobility operation:\n$message";

  // -f sets the envelope sender to the same domain mailbox (SPF alignment).
  if (mail($receiving_email_address, $mail_subject, $email_body, $headers, "-f$sending_email_address")) {
    echo "success";
  } else {
    echo "error";
  }
?>
