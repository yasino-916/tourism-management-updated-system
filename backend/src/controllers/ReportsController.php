<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class ReportsController
{
  private PDO $db;

  public function __construct(PDO $db)
  {
    $this->db = $db;
  }

  public function create(array $context, array $input): array
  {
    $guideId = (int) ($context['sub'] ?? 0);
    $requestId = (int) ($input['request_id'] ?? 0);
    $reportText = trim((string) ($input['report_text'] ?? ''));
    $date = $input['date'] ?? date('Y-m-d H:i:s');

    if ($requestId <= 0 || empty($reportText)) {
      return ['_status' => 400, 'error' => 'request_id and report_text are required'];
    }

    $stmt = $this->db->prepare('SELECT assigned_guide_id, request_status FROM GuideRequests WHERE request_id = :rid');
    $stmt->execute(['rid' => $requestId]);
    $req = $stmt->fetch();

    if (!$req) {
      return ['_status' => 404, 'error' => 'Request not found'];
    }

    $assignedGuideId = (int) $req['assigned_guide_id'];
    if ($assignedGuideId !== $guideId && $assignedGuideId != $guideId) {
      return ['_status' => 403, 'error' => 'You are not assigned to this request (Guide ID: ' . $guideId . ', Assigned: ' . $assignedGuideId . ')'];
    }

    $stmt = $this->db->prepare('INSERT INTO Reports (request_id, guide_id, report_text, report_date) VALUES (:rid, :gid, :txt, :dt)');
    $stmt->execute([
      'rid' => $requestId,
      'gid' => $guideId,
      'txt' => $reportText,
      'dt' => $date
    ]);

    return ['message' => 'Report submitted successfully', 'report_id' => $this->db->lastInsertId()];
  }

  public function list(): array
  {
    $stmt = $this->db->query('
            SELECT rep.*, g.first_name as guide_name, g.last_name as guide_last, r.site_id, s.site_name
            FROM Reports rep
            JOIN Users g ON rep.guide_id = g.user_id
            JOIN GuideRequests r ON rep.request_id = r.request_id
            LEFT JOIN Sites s ON r.site_id = s.site_id
            ORDER BY rep.created_at DESC
        ');
    return $stmt->fetchAll();
  }
}
