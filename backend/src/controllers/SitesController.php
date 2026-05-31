<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;
use Throwable;

use App\Services\NotificationService;

class SitesController
{
    public function __construct(private PDO $db, private NotificationService $notifications)
    {
    }

    public function index(): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return [];
            }

            $sql = "SELECT s.*, 
                           COALESCE(si.image_url, s.image_url) as image_url,
                           reg.region_name as region,
                           cat.category_name as category,
                           CONCAT(u.first_name, ' ', u.last_name) as researcher_name
                    FROM `$table` s 
                    LEFT JOIN SiteImages si ON s.site_id = si.site_id AND si.is_primary = 1
                    LEFT JOIN Regions reg ON s.region_id = reg.region_id
                    LEFT JOIN Categories cat ON s.category_id = cat.category_id
                    LEFT JOIN Users u ON s.created_by = u.user_id
                    ORDER BY s.created_at DESC";
            $stmt = $this->db->query($sql);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
            return $items;
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'An error occurred', 'detail' => $e->getMessage()];
        }
    }

    public function show(int $id): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }

            $sql = "SELECT s.*, 
                           COALESCE(si.image_url, s.image_url) as image_url,
                           reg.region_name as region,
                           cat.category_name as category,
                           CONCAT(u.first_name, ' ', u.last_name) as researcher_name
                    FROM `$table` s 
                    LEFT JOIN SiteImages si ON s.site_id = si.site_id AND si.is_primary = 1
                    LEFT JOIN Regions reg ON s.region_id = reg.region_id
                    LEFT JOIN Categories cat ON s.category_id = cat.category_id
                    LEFT JOIN Users u ON s.created_by = u.user_id
                    WHERE s.site_id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute(['id' => $id]);
            $site = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$site) {
                return ['_status' => 404, 'error' => 'Site not found'];
            }

            return $site;
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to fetch site', 'detail' => $e->getMessage()];
        }
    }

    public function store(array $context, array $input): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 500, 'error' => 'Sites table not found'];
            }

            $columns = $this->siteColumns($table);
            if (empty($columns)) {
                $columns = ['site_name', 'description', 'full_description', 'short_description', 'location', 'location_address', 'price', 'visit_price', 'visit_duration', 'estimated_duration', 'image_url', 'map_url', 'nearby_attractions', 'category_id', 'region_id', 'is_approved', 'status', 'created_by'];
            }

            $defaults = [
                'is_approved' => 1,
                'status' => 'approved',
                'created_by' => $context['sub'] ?? null,
                'researcher_id' => $context['sub'] ?? null,
            ];

            $map = [
                'site_name' => ['site_name', 'name', 'title'],
                'name' => ['name', 'site_name', 'title'],
                'title' => ['title', 'name', 'site_name'],
                'location' => ['location', 'location_address'],
                'location_address' => ['location_address', 'location'],
                'description' => ['description', 'full_description', 'short_description'],
                'full_description' => ['full_description', 'description'],
                'short_description' => ['short_description', 'description'],
                'price' => ['price', 'visit_price'],
                'visit_price' => ['visit_price', 'price'],
                'entrance_fee' => ['entrance_fee'],
                'guide_fee' => ['guide_fee'],
                'category_id' => ['category_id'],
                'region_id' => ['region_id'],
                'visit_duration' => ['visit_duration', 'estimated_duration'],
                'nearby_attractions' => ['nearby_attractions'],
                'map_url' => ['map_url'],
                'image' => ['image', 'image_url'],
                'image_url' => ['image_url', 'image'],
                'is_approved' => ['is_approved'],
                'status' => ['status'],
                'created_by' => ['created_by'],
                'researcher_id' => ['researcher_id'],
            ];

            $data = [];
            foreach ($map as $inputKey => $columnOptions) {

                if (!isset($input[$inputKey]) && !array_key_exists($inputKey, $input)) {
                    continue;
                }
                $val = $input[$inputKey];
                foreach ($columnOptions as $col) {
                    if (in_array($col, $columns, true)) {
                        $data[$col] = $val;
                        break;
                    }
                }
            }

            if (!isset($data['full_description']) && !empty($input['description']) && in_array('full_description', $columns, true)) {
                $data['full_description'] = $input['description'];
            }
            if (!isset($data['short_description']) && !empty($input['description']) && in_array('short_description', $columns, true)) {
                $data['short_description'] = mb_substr((string) $input['description'], 0, 255);
            }
            if (!isset($data['location_address']) && !empty($input['location']) && in_array('location_address', $columns, true)) {
                $data['location_address'] = $input['location'];
            }
            if (!isset($data['estimated_duration']) && !empty($input['visit_duration']) && in_array('estimated_duration', $columns, true)) {
                $data['estimated_duration'] = $input['visit_duration'];
            }
            if (!isset($data['image_url']) && !empty($input['image']) && in_array('image_url', $columns, true)) {
                $data['image_url'] = $input['image'];
            }
            if (!isset($data['visit_price']) && !empty($input['price']) && in_array('visit_price', $columns, true)) {
                $data['visit_price'] = $input['price'];
            }

            foreach ($defaults as $col => $val) {
                if (in_array($col, $columns, true) && !array_key_exists($col, $data)) {
                    $data[$col] = $val;
                }
            }

            if (empty($data)) {
                return ['_status' => 400, 'error' => 'No valid fields to insert. Check database schema.'];
            }

            $columnsSql = implode(', ', array_map(fn($c) => "`$c`", array_keys($data)));
            $placeholders = implode(', ', array_map(static fn($c) => ':' . $c, array_keys($data)));
            $sql = sprintf('INSERT INTO `%s` (%s) VALUES (%s)', $table, $columnsSql, $placeholders);

            $stmt = $this->db->prepare($sql);
            $stmt->execute($data);

            $id = (int) $this->db->lastInsertId();

            try {

                if (!empty($input['category'])) {
                    $catName = trim($input['category']);
                    $stmt = $this->db->prepare("SELECT category_id FROM Categories WHERE category_name = ?");
                    $stmt->execute([$catName]);
                    $catId = $stmt->fetchColumn();
                    if (!$catId) {
                        $stmt = $this->db->prepare("INSERT INTO Categories (category_name) VALUES (?)");
                        $stmt->execute([$catName]);
                        $catId = $this->db->lastInsertId();
                    }
                    if ($catId && in_array('category_id', $columns, true)) {
                        $this->db->prepare("UPDATE `$table` SET category_id = ? WHERE site_id = ?")->execute([$catId, $id]);
                    }
                }

                if (!empty($input['region'])) {
                    $regName = trim($input['region']);
                    $stmt = $this->db->prepare("SELECT region_id FROM Regions WHERE region_name = ?");
                    $stmt->execute([$regName]);
                    $regId = $stmt->fetchColumn();
                    if (!$regId) {
                        $stmt = $this->db->prepare("INSERT INTO Regions (region_name) VALUES (?)");
                        $stmt->execute([$regName]);
                        $regId = $this->db->lastInsertId();
                    }
                    if ($regId && in_array('region_id', $columns, true)) {
                        $this->db->prepare("UPDATE `$table` SET region_id = ? WHERE site_id = ?")->execute([$regId, $id]);
                    }
                }

                if (!empty($input['image'])) {
                    $imgUrl = trim($input['image']);
                    $stmt = $this->db->prepare("INSERT INTO SiteImages (site_id, image_url, is_primary, uploaded_by) VALUES (?, ?, 1, ?)");
                    $stmt->execute([$id, $imgUrl, $context['sub'] ?? null]);
                }

            } catch (Throwable $e) {

            }

            try {
                $stmt = $this->db->prepare(
                    "INSERT INTO ResearcherActivities (researcher_id, activity_type, description, related_site_id) 
                     VALUES (:uid, 'add_site', :desc, :sid)"
                );
                $stmt->execute([
                    'uid' => $context['sub'] ?? null,
                    'desc' => "Added new site: " . ($data['site_name'] ?? 'Unknown'),
                    'sid' => $id
                ]);
            } catch (Throwable $e) {

            }

            $this->notifications->notifyAdmins(
                'New Site Submitted',
                "A new site '" . ($data['site_name'] ?? 'Unknown') . "' has been submitted (auto-approved).",
                'system'
            );

            return [
                'message' => 'Site saved successfully',
                'site_id' => $id,
                'is_approved' => $data['is_approved'] ?? true,
                'status' => $data['status'] ?? 'approved'
            ];

        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to create site', 'detail' => $e->getMessage()];
        }
    }

    public function approve(int $id, array $context): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 500, 'error' => 'Sites table not found'];
            }

            $columns = $this->siteColumns($table);

            if (in_array('is_approved', $columns, true)) {
                $stmt = $this->db->prepare("UPDATE `$table` SET is_approved = :approved WHERE site_id = :id");
                $stmt->execute(['approved' => 1, 'id' => $id]);
            }

            if (in_array('status', $columns, true)) {
                $stmt = $this->db->prepare("UPDATE `$table` SET status = 'approved' WHERE site_id = :id");
                $stmt->execute(['id' => $id]);
            }

            if (!in_array('is_approved', $columns, true) && !in_array('status', $columns, true)) {
                return ['_status' => 500, 'error' => 'No approval column found'];
            }

            $potentialCols = ['site_name', 'researcher_id', 'created_by'];
            $selectCols = array_intersect($potentialCols, $columns);

            if (!empty($selectCols)) {
                $colsSql = implode(', ', array_map(fn($c) => "`$c`", $selectCols));
                $stmt = $this->db->prepare("SELECT $colsSql FROM `$table` WHERE site_id = ?");
                $stmt->execute([$id]);
                $site = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($site) {
                    $researcherId = $site['researcher_id'] ?? $site['created_by'] ?? null;
                    $siteName = $site['site_name'] ?? 'Site #' . $id;

                    if ($researcherId) {
                        try {
                            $this->notifications->create(
                                (int) $researcherId,
                                'Site Approved',
                                "Your site '{$siteName}' has been approved by admin.",
                                'system'
                            );
                        } catch (Throwable $e) {

                        }
                    }
                }
            }

            return [
                'message' => 'Site approved',
                'site_id' => $id,
                'approved_by' => $context['sub'] ?? null,
            ];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to approve site', 'detail' => $e->getMessage()];
        }
    }

    public function update(array $context, int $id, array $input): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }

            $columns = $this->siteColumns($table);
            $updates = [];
            $params = ['id' => $id];

            if (isset($input['region']) && !empty($input['region']) && in_array('region_id', $columns, true)) {
                $regName = trim($input['region']);
                $stmt = $this->db->prepare("SELECT region_id FROM Regions WHERE region_name = ?");
                $stmt->execute([$regName]);
                $regId = $stmt->fetchColumn();
                if (!$regId) {
                    $stmt = $this->db->prepare("INSERT INTO Regions (region_name) VALUES (?)");
                    $stmt->execute([$regName]);
                    $regId = $this->db->lastInsertId();
                }
                $updates[] = "`region_id` = :region_id";
                $params['region_id'] = $regId;
                unset($input['region']);
            }

            if (isset($input['category']) && !empty($input['category']) && in_array('category_id', $columns, true)) {
                $catName = trim($input['category']);
                $stmt = $this->db->prepare("SELECT category_id FROM Categories WHERE category_name = ?");
                $stmt->execute([$catName]);
                $catId = $stmt->fetchColumn();
                if (!$catId) {
                    $stmt = $this->db->prepare("INSERT INTO Categories (category_name) VALUES (?)");
                    $stmt->execute([$catName]);
                    $catId = $this->db->lastInsertId();
                }
                $updates[] = "`category_id` = :category_id";
                $params['category_id'] = $catId;
                unset($input['category']);
            }

            if (isset($input['image']) && !empty($input['image'])) {
                $imgUrl = trim($input['image']);

                $checkStmt = $this->db->prepare("SELECT image_id FROM SiteImages WHERE site_id = ? AND is_primary = 1 LIMIT 1");
                $checkStmt->execute([$id]);
                $existingImgId = $checkStmt->fetchColumn();

                if ($existingImgId) {
                    $this->db->prepare("UPDATE SiteImages SET image_url = ?, uploaded_by = ? WHERE image_id = ?")
                        ->execute([$imgUrl, $context['sub'] ?? null, $existingImgId]);
                } else {
                    $this->db->prepare("INSERT INTO SiteImages (site_id, image_url, is_primary, uploaded_by) VALUES (?, ?, 1, ?)")
                        ->execute([$id, $imgUrl, $context['sub'] ?? null]);
                }

                if (in_array('image_url', $columns, true)) {
                    $updates[] = "`image_url` = :image_url";
                    $params['image_url'] = $imgUrl;
                }
                unset($input['image']);
            }

            $map = [
                'site_name' => 'site_name',
                'description' => 'full_description',
                'location' => 'location_address',
                'price' => 'visit_price',
                'visit_duration' => 'estimated_duration',
                'map_url' => 'map_url',
                'nearby_attractions' => 'nearby_attractions',
            ];

            foreach ($map as $inputKey => $dbCol) {
                if (isset($input[$inputKey]) && in_array($dbCol, $columns, true)) {
                    $updates[] = "`$dbCol` = :$dbCol";
                    $params[$dbCol] = $input[$inputKey];
                }
            }

            foreach ($input as $key => $val) {
                if (in_array($key, $columns, true) && !isset($params[$key]) && !in_array($key, ['site_id', 'id'])) {
                    $updates[] = "`$key` = :$key";
                    $params[$key] = $val;
                }
            }

            if (in_array('is_approved', $columns, true) && !isset($input['is_approved']) && !isset($input['status'])) {
                $updates[] = "`is_approved` = 0";
                if (in_array('status', $columns, true)) {
                    $updates[] = "`status` = 'pending'";
                }
            }

            if (empty($updates)) {
                return ['message' => 'No changes provided'];
            }

            $sql = "UPDATE `$table` SET " . implode(', ', $updates) . " WHERE site_id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return [
                'message' => 'Site updated successfully',
                'site_id' => $id
            ];
        } catch (Throwable $e) {
            error_log("Update error for site $id: " . $e->getMessage());
            return [
                '_status' => 500,
                'error' => 'Failed to update site. ' . $e->getMessage()
            ];
        }
    }

    public function delete(int $id): array
    {
        try {
            $table = $this->resolveSitesTable();
            if (!$table) {
                return ['_status' => 404, 'error' => 'Sites table not found'];
            }

            $this->db->prepare("DELETE FROM Reviews WHERE site_id = ?")->execute([$id]);

            $stmt = $this->db->prepare("SELECT request_id FROM GuideRequests WHERE site_id = ?");
            $stmt->execute([$id]);
            $requestIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

            if (!empty($requestIds)) {
                $inQuery = implode(',', array_fill(0, count($requestIds), '?'));

                $stmtP = $this->db->prepare("SELECT payment_id FROM Payments WHERE request_id IN ($inQuery)");
                $stmtP->execute($requestIds);
                $paymentIds = $stmtP->fetchAll(PDO::FETCH_COLUMN);

                if (!empty($paymentIds)) {
                    $inPayment = implode(',', array_fill(0, count($paymentIds), '?'));
                    $this->db->prepare("DELETE FROM Notifications WHERE related_payment_id IN ($inPayment)")->execute($paymentIds);

                }

                $this->db->prepare("DELETE FROM Notifications WHERE related_request_id IN ($inQuery)")->execute($requestIds);

                $this->db->prepare("DELETE FROM Payments WHERE request_id IN ($inQuery)")->execute($requestIds);

                $this->db->prepare("DELETE FROM Visits WHERE request_id IN ($inQuery)")->execute($requestIds);

                $this->db->prepare("DELETE FROM GuideRequests WHERE site_id = ?")->execute([$id]);
            }

            $this->db->prepare("DELETE FROM ResearcherActivities WHERE related_site_id = ?")->execute([$id]);
            $this->db->prepare("DELETE FROM SiteSubmissions WHERE site_id = ?")->execute([$id]);

            $this->db->prepare("DELETE FROM SiteImages WHERE site_id = ?")->execute([$id]);
            $this->db->prepare("DELETE FROM SiteGuideTypes WHERE site_id = ?")->execute([$id]);

            $stmt = $this->db->prepare("DELETE FROM `$table` WHERE site_id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                return ['_status' => 404, 'error' => 'Site not found'];
            }
            return ['message' => 'Site deleted'];
        } catch (Throwable $e) {
            return ['_status' => 500, 'error' => 'Failed to delete site', 'detail' => $e->getMessage()];
        }
    }

    private function resolveSitesTable(): ?string
    {
        foreach (['Sites', 'sites'] as $candidate) {
            $like = $this->db->quote($candidate);
            $stmt = $this->db->query("SHOW TABLES LIKE $like");
            if ($stmt && $stmt->fetchColumn()) {
                return $candidate;
            }
        }
        return null;
    }

    private function resolveSubmissionTable(): ?string
    {
        foreach (['SiteSubmissions', 'sitesubmissions'] as $candidate) {
            $like = $this->db->quote($candidate);
            $stmt = $this->db->query("SHOW TABLES LIKE $like");
            if ($stmt && $stmt->fetchColumn()) {
                return $candidate;
            }
        }
        return null;
    }

    private function siteColumns(string $table): array
    {
        $dbName = $this->db->query('SELECT DATABASE()')->fetchColumn();
        if (!$dbName) {
            return [];
        }
        $stmt = $this->db->prepare('SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = :db AND TABLE_NAME = :table');
        $stmt->execute(['db' => $dbName, 'table' => $table]);
        return array_column($stmt->fetchAll(), 'COLUMN_NAME');
    }
}
