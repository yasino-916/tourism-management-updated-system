<?php
$envFile = __DIR__ . '/.env';
$keys = [
  'CHAPA_PUBLIC_KEY' => 'CHAPUBK_TEST-VId31xP8eVlUSfCs0DjexeGps7uRGllN',
  'CHAPA_SECRET_KEY' => 'CHASECK_TEST-99tiecjRwNVWTRQg0lleVawR5rfVlvqs'
];

$content = '';
if (file_exists($envFile)) {
  $content = file_get_contents($envFile);
}

foreach ($keys as $key => $value) {
  if (preg_match("/^{$key}=/m", $content)) {
    $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
  } else {
    $content .= "\n{$key}={$value}";
  }
}

file_put_contents($envFile, trim($content) . "\n");
echo "Updated keys in .env\n";
