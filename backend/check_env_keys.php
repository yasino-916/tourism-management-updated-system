<?php
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
  $lines = file($envFile);
  foreach ($lines as $line) {
    if (trim($line) && !str_starts_with(trim($line), '#')) {
      $parts = explode('=', $line, 2);
      echo $parts[0] . "\n";
    }
  }
}
