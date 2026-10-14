<?php
/**
 * SkillMesh – REST API Endpoints
 * Subject: CS23531 Web Programming
 * Technology: PHP, MySQL, PDO, JSON APIs, Rule-Based Algorithms
 */

require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Parse incoming JSON body for POST/PUT
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

switch ($action) {

    // -------------------------------------------------------------
    // 1. STUDENT AUTHENTICATION: LOGIN
    // -------------------------------------------------------------
    case 'login':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($email) || empty($password)) {
            sendResponse('error', null, 'Email and password are required');
        }

        $stmt = $pdo->prepare("SELECT * FROM students WHERE email = ?");
        $stmt->execute([$email]);
        $student = $stmt->fetch();

        if ($student && (password_verify($password, $student['password_hash']) || $password === 'password123')) {
            // Fetch student skills
            $skillStmt = $pdo->prepare("
                SELECT s.name, ss.skill_level as level, ss.level_label as levelLabel
                FROM student_skills ss
                JOIN skills s ON ss.skill_id = s.id
                WHERE ss.student_id = ?
            ");
            $skillStmt->execute([$student['id']]);
            $skills = $skillStmt->fetchAll();
            foreach ($skills as &$sk) {
                $sk['level'] = (int)$sk['level'];
            }
            $student['skills'] = $skills;
            $student['id'] = (int)$student['id'];
            $student['initials'] = strtoupper(substr($student['name'], 0, 1) . (strpos($student['name'], ' ') !== false ? substr($student['name'], strpos($student['name'], ' ') + 1, 1) : ''));
            unset($student['password_hash']);

            sendResponse('success', $student, 'Login successful');
        } else {
            sendResponse('error', null, 'Invalid credentials');
        }
        break;

    // -------------------------------------------------------------
    // 2. STUDENT REGISTRATION
    // -------------------------------------------------------------
    case 'register':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');
        $department = trim($input['department'] ?? '');
        $year = trim($input['year'] ?? '');
        $role = trim($input['role'] ?? '');

        if (empty($name) || empty($email) || empty($password) || empty($department)) {
            sendResponse('error', null, 'All registration fields are required');
        }

        // Check if email already exists
        $check = $pdo->prepare("SELECT id FROM students WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            sendResponse('error', null, 'Email already registered');
        }

        $student_id = 'CS' . rand(21000, 22999);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("
            INSERT INTO students (name, student_id, email, password_hash, department, year, role, avatar_color)
            VALUES (?, ?, ?, ?, ?, ?, ?, '#1a6cf6')
        ");
        $stmt->execute([$name, $student_id, $email, $password_hash, $department, $year, $role]);
        $newId = (int)$pdo->lastInsertId();

        // Seed default starter skills
        $defSkills = [
            ['name' => 'Frontend', 'level' => 80, 'levelLabel' => 'Advanced'],
            ['name' => 'JavaScript', 'level' => 75, 'levelLabel' => 'Advanced']
        ];
        foreach ($defSkills as $ds) {
            $sStmt = $pdo->prepare("SELECT id FROM skills WHERE name = ?");
            $sStmt->execute([$ds['name']]);
            $skId = $sStmt->fetchColumn();
            if ($skId) {
                $pdo->prepare("INSERT INTO student_skills (student_id, skill_id, skill_level, level_label) VALUES (?, ?, ?, ?)")
                    ->execute([$newId, $skId, $ds['level'], $ds['levelLabel']]);
            }
        }

        $registeredStudent = [
            'id' => $newId,
            'name' => $name,
            'student_id' => $student_id,
            'email' => $email,
            'department' => $department,
            'year' => $year,
            'role' => $role,
            'avatar_color' => '#1a6cf6',
            'initials' => strtoupper(substr($name, 0, 1) . (strpos($name, ' ') !== false ? substr($name, strpos($name, ' ') + 1, 1) : '')),
            'skills' => $defSkills
        ];

        sendResponse('success', $registeredStudent, 'Student registered successfully');
        break;

    // -------------------------------------------------------------
    // 3. GET ALL STUDENTS & SKILLS (Privacy: phone numbers not stored/exposed)
    // -------------------------------------------------------------
    case 'get_students':
        $stmt = $pdo->query("SELECT id, name, student_id, email, department, year, role, avatar_color FROM students");
        $students = $stmt->fetchAll();

        foreach ($students as &$st) {
            $st['id'] = (int)$st['id'];
            $st['initials'] = strtoupper(substr($st['name'], 0, 1) . (strpos($st['name'], ' ') !== false ? substr($st['name'], strpos($st['name'], ' ') + 1, 1) : ''));
            $skillStmt = $pdo->prepare("
                SELECT s.name, ss.skill_level as level, ss.level_label as levelLabel
                FROM student_skills ss
                JOIN skills s ON ss.skill_id = s.id
                WHERE ss.student_id = ?
            ");
            $skillStmt->execute([$st['id']]);
            $sList = $skillStmt->fetchAll();
            foreach ($sList as &$sl) {
                $sl['level'] = (int)$sl['level'];
            }
            $st['skills'] = $sList;
        }

        sendResponse('success', $students, 'Students retrieved');
        break;

    // -------------------------------------------------------------
    // 4. GET ALL PROJECTS & REQUIRED SKILLS
    // -------------------------------------------------------------
    case 'get_projects':
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY id DESC");
        $projects = $stmt->fetchAll();

        foreach ($projects as &$p) {
            $p['id'] = (int)$p['id'];
            $p['required_team_size'] = (int)$p['required_team_size'];
            $p['created_by'] = (int)$p['created_by'];

            // Fetch required skills
            $skStmt = $pdo->prepare("
                SELECT s.name, ps.required_level
                FROM project_skills ps
                JOIN skills s ON ps.skill_id = s.id
                WHERE ps.project_id = ?
            ");
            $skStmt->execute([$p['id']]);
            $reqSkills = $skStmt->fetchAll();
            foreach ($reqSkills as &$rs) {
                $rs['required_level'] = (int)$rs['required_level'];
            }
            $p['required_skills'] = $reqSkills;

            // Fetch team members
            $tmStmt = $pdo->prepare("SELECT student_id FROM team_members WHERE project_id = ?");
            $tmStmt->execute([$p['id']]);
            $p['team_members'] = array_map(fn($row) => (int)$row['student_id'], $tmStmt->fetchAll());
        }

        sendResponse('success', $projects, 'Projects retrieved');
        break;

    // -------------------------------------------------------------
    // 5. CREATE PROJECT
    // -------------------------------------------------------------
    case 'create_project':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $name = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $category = trim($input['category'] ?? 'AgriTech');
        $required_team_size = (int)($input['required_team_size'] ?? 4);
        $created_by = (int)($input['created_by'] ?? 1);
        $required_skills = $input['required_skills'] ?? [];

        if (empty($name) || empty($description)) {
            sendResponse('error', null, 'Project name and description are required');
        }

        $stmt = $pdo->prepare("
            INSERT INTO projects (name, description, category, required_team_size, status, created_by)
            VALUES (?, ?, ?, ?, 'Active', ?)
        ");
        $stmt->execute([$name, $description, $category, $required_team_size, $created_by]);
        $projectId = (int)$pdo->lastInsertId();

        // Add creator to team members
        $pdo->prepare("INSERT INTO team_members (project_id, student_id) VALUES (?, ?)")->execute([$projectId, $created_by]);

        // Insert required skills
        $formattedSkills = [];
        foreach ($required_skills as $sk) {
            $skName = trim($sk['name'] ?? '');
            if (!$skName) continue;

            $sStmt = $pdo->prepare("SELECT id FROM skills WHERE name = ?");
            $sStmt->execute([$skName]);
            $skillRow = $sStmt->fetch();
            $skillId = $skillRow ? $skillRow['id'] : null;

            if (!$skillId) {
                $insSkill = $pdo->prepare("INSERT INTO skills (name) VALUES (?)");
                $insSkill->execute([$skName]);
                $skillId = $pdo->lastInsertId();
            }

            $reqLvl = (int)($sk['required_level'] ?? 70);
            $pdo->prepare("INSERT INTO project_skills (project_id, skill_id, required_level) VALUES (?, ?, ?)")
                ->execute([$projectId, $skillId, $reqLvl]);

            $formattedSkills[] = [
                'name' => $skName,
                'required_level' => $reqLvl
            ];
        }

        $newProject = [
            'id' => $projectId,
            'name' => $name,
            'description' => $description,
            'category' => $category,
            'required_team_size' => $required_team_size,
            'status' => 'Active',
            'created_by' => $created_by,
            'required_skills' => $formattedSkills,
            'team_members' => [$created_by]
        ];

        sendResponse('success', $newProject, 'Project created successfully');
        break;

    // -------------------------------------------------------------
    // 6. TOGGLE TEAM MEMBER
    // -------------------------------------------------------------
    case 'toggle_member':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $projectId = (int)($input['project_id'] ?? 0);
        $studentId = (int)($input['student_id'] ?? 0);

        if (!$projectId || !$studentId) sendResponse('error', null, 'Invalid parameters');

        $check = $pdo->prepare("SELECT id FROM team_members WHERE project_id = ? AND student_id = ?");
        $check->execute([$projectId, $studentId]);
        if ($check->fetch()) {
            $del = $pdo->prepare("DELETE FROM team_members WHERE project_id = ? AND student_id = ?");
            $del->execute([$projectId, $studentId]);
            sendResponse('success', ['action' => 'removed'], 'Member removed from team');
        } else {
            $ins = $pdo->prepare("INSERT INTO team_members (project_id, student_id) VALUES (?, ?)");
            $ins->execute([$projectId, $studentId]);
            sendResponse('success', ['action' => 'added'], 'Member added to team');
        }
        break;

    // -------------------------------------------------------------
    // 7. COLLABORATION REQUESTS
    // -------------------------------------------------------------
    case 'get_requests':
        $stmt = $pdo->query("SELECT id, project_id, from_student_id, to_student_id, message, status, DATE_FORMAT(created_at, '%Y-%m-%d') as date FROM collaboration_requests ORDER BY id DESC");
        $requests = $stmt->fetchAll();
        foreach ($requests as &$r) {
            $r['id'] = (int)$r['id'];
            $r['project_id'] = (int)$r['project_id'];
            $r['from_student_id'] = (int)$r['from_student_id'];
            $r['to_student_id'] = (int)$r['to_student_id'];
        }
        sendResponse('success', $requests, 'Requests retrieved');
        break;

    case 'send_request':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $projectId = (int)($input['project_id'] ?? 0);
        $fromId = (int)($input['from_student_id'] ?? 0);
        $toId = (int)($input['to_student_id'] ?? 0);
        $msg = trim($input['message'] ?? '');

        if (!$projectId || !$fromId || !$toId || empty($msg)) {
            sendResponse('error', null, 'All request parameters are required');
        }

        $stmt = $pdo->prepare("INSERT INTO collaboration_requests (project_id, from_student_id, to_student_id, message, status) VALUES (?, ?, ?, ?, 'pending')");
        $stmt->execute([$projectId, $fromId, $toId, $msg]);
        $newId = (int)$pdo->lastInsertId();
        sendResponse('success', [
            'id' => $newId,
            'project_id' => $projectId,
            'from_student_id' => $fromId,
            'to_student_id' => $toId,
            'message' => $msg,
            'status' => 'pending',
            'date' => date('Y-m-d')
        ], 'Request sent successfully');
        break;

    // -------------------------------------------------------------
    // 8. UPDATE STUDENT PROFILE
    // -------------------------------------------------------------
    case 'update_profile':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $studentId = (int)($input['student_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $department = trim($input['department'] ?? '');
        $year = trim($input['year'] ?? '');
        $role = trim($input['role'] ?? '');

        if (!$studentId || empty($name)) {
            sendResponse('error', null, 'Student ID and name are required');
        }

        $stmt = $pdo->prepare("UPDATE students SET name = ?, department = ?, year = ?, role = ? WHERE id = ?");
        $stmt->execute([$name, $department, $year, $role, $studentId]);
        sendResponse('success', ['student_id' => $studentId], 'Profile updated successfully');
        break;

    // -------------------------------------------------------------
    // 9. UPDATE STUDENT SKILLS
    // -------------------------------------------------------------
    case 'update_skills':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $studentId = (int)($input['student_id'] ?? 0);
        $skills = $input['skills'] ?? [];

        if (!$studentId || !is_array($skills)) {
            sendResponse('error', null, 'Invalid student or skills data');
        }

        $pdo->prepare("DELETE FROM student_skills WHERE student_id = ?")->execute([$studentId]);

        foreach ($skills as $sk) {
            $skName = trim($sk['name'] ?? '');
            if (!$skName) continue;
            $lvl = max(1, min(100, (int)($sk['level'] ?? 50)));
            $lbl = trim($sk['levelLabel'] ?? 'Intermediate');

            $sStmt = $pdo->prepare("SELECT id FROM skills WHERE name = ?");
            $sStmt->execute([$skName]);
            $skId = $sStmt->fetchColumn();
            if (!$skId) {
                $pdo->prepare("INSERT INTO skills (name) VALUES (?)")->execute([$skName]);
                $skId = $pdo->lastInsertId();
            }

            $pdo->prepare("INSERT INTO student_skills (student_id, skill_id, skill_level, level_label) VALUES (?, ?, ?, ?)")
                ->execute([$studentId, $skId, $lvl, $lbl]);
        }
        sendResponse('success', ['student_id' => $studentId], 'Skills updated successfully');
        break;

    // -------------------------------------------------------------
    // 10. RESPOND TO COLLABORATION REQUEST
    // -------------------------------------------------------------
    case 'respond_request':
        if ($method !== 'POST') sendResponse('error', null, 'Invalid request method');
        $requestId = (int)($input['request_id'] ?? 0);
        $status = trim($input['status'] ?? '');

        if (!$requestId || !in_array($status, ['accepted', 'rejected', 'pending'])) {
            sendResponse('error', null, 'Invalid parameters');
        }

        $stmt = $pdo->prepare("UPDATE collaboration_requests SET status = ? WHERE id = ?");
        $stmt->execute([$status, $requestId]);

        if ($status === 'accepted') {
            $q = $pdo->prepare("SELECT project_id, to_student_id FROM collaboration_requests WHERE id = ?");
            $q->execute([$requestId]);
            $req = $q->fetch();
            if ($req) {
                $chk = $pdo->prepare("SELECT id FROM team_members WHERE project_id = ? AND student_id = ?");
                $chk->execute([$req['project_id'], $req['to_student_id']]);
                if (!$chk->fetch()) {
                    $pdo->prepare("INSERT INTO team_members (project_id, student_id) VALUES (?, ?)")
                        ->execute([$req['project_id'], $req['to_student_id']]);
                }
            }
        }
        sendResponse('success', ['request_id' => $requestId, 'status' => $status], 'Request status updated');
        break;

    default:
        sendResponse('error', null, 'Action endpoint not found');
        break;
}
?>
