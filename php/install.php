<?php
/**
 * SkillMesh – Automated Database Installer
 * Run this file in your browser or CLI to create all tables and populate seed data.
 * URL: http://localhost/SkillMesh/php/install.php
 *
 * Configuration: copy php/config.example.php → php/config.php and set your credentials.
 * Falls back to standard XAMPP defaults when config.php is absent.
 */

if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    $db_host = DB_HOST;
    $db_user = DB_USER;
    $db_pass = DB_PASS;
    $db_name = DB_NAME;
} else {
    $db_host = 'localhost';
    $db_user = 'root';
    $db_pass = ''; // XAMPP default – blank password
    $db_name = 'skillmesh_db';
}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SkillMesh – Database Setup</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body class="bg-surface-2 p-5">
  <div class="container" style="max-width: 700px;">
    <div class="card sm-card border-0 shadow-lg p-4 p-md-5 bg-white rounded-4">
      <div class="text-center mb-4">
        <h3 class="fw-bold text-primary">SkillMesh Database Setup</h3>
        <p class="text-muted small">CS23531 Web Programming – MySQL Database Initialization</p>
      </div>

      <?php
      try {
          // Connect to MySQL server (use DB_PORTS if set, otherwise try configured port or default 3306)
          $ports = defined('DB_PORTS') ? DB_PORTS : [3306];
          $pdo = null;
          $lastErr = '';
          foreach ($ports as $port) {
              try {
                  $pdo = new PDO("mysql:host=$db_host;port=$port", $db_user, $db_pass, [
                      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                      PDO::ATTR_TIMEOUT => 5
                  ]);
                  break;
              } catch (PDOException $e) {
                  $lastErr = $e->getMessage();
              }
          }
          if (!$pdo) {
              throw new Exception("Could not connect to MySQL: " . $lastErr);
          }

          $sqlFile = __DIR__ . '/../database/schema.sql';
          if (!file_exists($sqlFile)) {
              throw new Exception("Schema file not found at: $sqlFile");
          }

          $sql = file_get_contents($sqlFile);
          $pdo->exec($sql);

          echo '
          <div class="alert alert-success d-flex align-items-center gap-2">
            <i class="bi bi-check-circle-fill fs-4"></i>
            <div>
              <strong>Database Installed Successfully!</strong><br>
              Database <code>skillmesh_db</code> and all tables/seed data have been created.
            </div>
          </div>
          
          <div class="p-3 bg-light rounded-3 my-3 small">
            <h6>Tables Initialized:</h6>
            <ul class="mb-0">
              <li><code>students</code> (6 sample student accounts)</li>
              <li><code>skills</code> (15 skill master records)</li>
              <li><code>student_skills</code> (Proficiency mappings)</li>
              <li><code>projects</code> (Smart Agriculture Platform & Campus Event System)</li>
              <li><code>project_skills</code> (Threshold percentages)</li>
              <li><code>team_members</code> (Active team rosters)</li>
              <li><code>collaboration_requests</code> (Sample invitations)</li>
            </ul>
          </div>

          <div class="d-grid mt-4">
            <a href="../index.html" class="btn btn-primary btn-lg rounded-pill">Open SkillMesh Application &rarr;</a>
          </div>
          ';
      } catch (Exception $e) {
          echo '
          <div class="alert alert-danger">
            <h5>Setup Error:</h5>
            <p>' . htmlspecialchars($e->getMessage()) . '</p>
            <hr>
            <p class="small mb-0">Ensure MySQL is running in XAMPP/WAMP (Host: localhost, User: root, Password: blank).</p>
          </div>
          ';
      }
      ?>
    </div>
  </div>
</body>
</html>
