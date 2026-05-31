<?php

declare(strict_types=1);

use App\Config\Database;

require __DIR__ . '/../vendor/autoload.php';

try {
    $pdo = Database::make();
    
    $sql = "UPDATE Users SET user_type = 'guide' WHERE user_type = '' OR user_type IS NULL";
    $stmt = $pdo->query($sql);
    
    echo "Updated " . $stmt->rowCount() . " users to type 'guide'.\n";
    
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
