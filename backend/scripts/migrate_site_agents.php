<?php

declare(strict_types=1);

use App\Config\Database;

require __DIR__ . '/../vendor/autoload.php';

try {
    $pdo = Database::make();

    $pdo->exec("ALTER TABLE Users MODIFY user_type ENUM('visitor','researcher','admin','guide','site_agent') NOT NULL");

    $stmt = $pdo->prepare("UPDATE Users SET user_type = 'site_agent' WHERE user_type = 'guide'");
    $stmt->execute();

    echo "Updated " . $stmt->rowCount() . " users to site_agent.\nMigration complete.\n";
} catch (Throwable $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
