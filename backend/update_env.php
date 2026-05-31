<?php
$envFile = __DIR__ . '/.env';
$keys = [
  'CHAPA_PUBLIC_KEY' => 'CHAPUBK_TEST-VId31xP8eVlUSfCs0DjexeGps7uRGllN',
  'CHAPA_SECRET_KEY' => 'CHASECK_TEST-99tiecjRwNVWTRQg0lleVawR5rfVlvqs',
  'API_URL' => 'http://localhost:8000',
  'APP_URL' => 'http://localhost:3000',
  'JWT_SECRET' => 'your-secret-key-here'
];

$content = '';
if (file_exists($envFile)) {
  $content = file_get_contents($envFile);
}

foreach ($keys as $key => $value) {
  if (preg_match("/^{$key}=/m", $content)) {
    $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
  } else {
    if (!empty($content) && !str_ends_with($content, "\n")) {
      $content .= "\n";
    }
    $content .= "{$key}={$value}\n";
  }
}

file_put_contents($envFile, trim($content) . "\n");
echo "Updated keys and URLs in .env\n";
