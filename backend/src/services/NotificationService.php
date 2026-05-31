<?php

declare(strict_types=1);

namespace App\Services;

use PDO;

class NotificationService
{
    public function __construct(private PDO $db)
    {
    }

    public function create(int $userId, string $title, string $message, string $type, ?int $requestId = null, ?int $paymentId = null): void
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO Notifications (user_id, title, message, notification_type, related_request_id, related_payment_id)
                 VALUES (:user_id, :title, :message, :type, :request_id, :payment_id)'
            );
            $stmt->execute([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'request_id' => $requestId,
                'payment_id' => $paymentId,
            ]);
        } catch (\Throwable $e) {

            error_log("Notification Create Error: " . $e->getMessage());
        }
    }

    public function notifyAdmins(string $title, string $message, string $type, ?int $requestId = null, ?int $paymentId = null): void
    {

        $stmt = $this->db->query("SELECT user_id FROM Users WHERE user_type = 'admin'");
        $admins = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($admins as $adminId) {
            $this->create((int) $adminId, $title, $message, $type, $requestId, $paymentId);
        }
    }
    public function deleteNotification(int $id, int $userId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM Notifications WHERE notification_id = :id AND user_id = :user_id');
        return $stmt->execute(['id' => $id, 'user_id' => $userId]);
    }
}
