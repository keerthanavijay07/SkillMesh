# SkillMesh – Project Team Intelligence Platform

> **Tagline:** *"Build Better Teams. Build Better Projects."*  
> **Course:** CS23531 – Web Programming  
> **Type:** Individual Academic Project

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement & Objectives](#-problem-statement--objectives)
3. [Features & Modules](#-features--modules)
4. [Technology Stack](#-technology-stack)
5. [Project Folder Structure](#-project-folder-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [MySQL Database Configuration](#-mysql-database-configuration)
9. [Running the Project Locally](#-running-the-project-locally)
10. [Demo Accounts](#-demo-accounts)
11. [Screenshots](#-screenshots)
12. [Rule-Based Intelligence Algorithms](#-rule-based-intelligence-algorithms)
13. [API Endpoints](#-api-endpoints)
14. [Limitations & Future Enhancements](#-limitations--future-enhancements)

---

## 🎯 Project Overview

**SkillMesh** is a full-stack, browser-based **Project Team Intelligence Platform** built for university students. It replaces haphazard, friendship-based team formation with transparent, data-driven skill composition analysis.

Students can:
- Register a profile with quantified skill ratings
- Create project definitions with skill requirements and thresholds
- Analyse team compositions with live health scores
- Detect structural risks (skill gaps, single-member bottlenecks, understaffing)
- Receive AI-free, rule-based peer recommendations
- Send and manage collaboration invitations

The application runs fully in-browser as a React single-page application and optionally connects to a PHP + MySQL backend for persistent multi-user data.

---

## 🧩 Problem Statement & Objectives

### Problem
University students traditionally form project teams based on social friendships rather than complementary skills. This leads to:

1. **Critical Skill Gaps** – Teams lack essential competencies (e.g., no backend developer, no domain expert).
2. **Single-Member Dependencies** – One student carries multiple critical skill areas, creating bottlenecks and burnout.
3. **Workload Imbalance** – Undersized or oversized teams suffer uneven contribution distributions.

### Objectives
- Provide a transparent tool to evaluate team compositions *before* the project starts.
- Quantify skill coverage against project-defined thresholds.
- Detect and rank structural risks with severity levels.
- Suggest suitable unselected peers based on skill compatibility scores.
- Demonstrate a full web programming stack: HTML, CSS, Bootstrap, JavaScript, React, PHP, and MySQL.

---

## ✨ Features & Modules

| Module | Description |
|--------|-------------|
| **Authentication** | Student login and registration with bcrypt password hashing |
| **Student Dashboard** | Overview of joined projects and personal skill radar |
| **Project Explorer** | Directory of all projects with skill requirements and team status |
| **Project Creator** | Wizard to define project name, category, team size, and required skill thresholds |
| **Team Builder** | Add/remove team members and watch health scores recalculate in real-time |
| **Team Health Score** | Multi-factor composite index (0–100) covering coverage, diversity, and dependency resilience |
| **Risk Detection Engine** | Eight rule-based heuristics classifying project vulnerabilities as HIGH / MEDIUM / LOW |
| **Skill Gap Analysis** | Matrix of required vs. actual coverage with suggested candidates |
| **Peer Recommendations** | Compatibility scoring of unselected students against project gaps |
| **Collaboration Requests** | Send, receive, accept, and reject team invitations with persistent status |
| **Student Directory** | Searchable roster of all registered students and their skill profiles |
| **Profile Editor** | Edit name, department, year, role, and skill ratings |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Structure | HTML5 (Semantic) | Page layout, accessibility, modal dialogs |
| Styling | CSS3 + Custom Design System | CSS variables, animations, responsive grid |
| Component Library | Bootstrap 5.3 | Grid, utilities, badges, progress bars, cards |
| Frontend Logic | JavaScript ES6+ | Rule-based algorithms, validation, utilities |
| UI Framework | React 18 (Babel Standalone) | Component model, hooks, in-browser JSX transpilation |
| Routing | Custom Hash Router | `window.location.hash`-based SPA routing without bundlers |
| Backend | PHP 8 | REST API endpoints, server-side logic |
| DB Connectivity | PHP PDO | Prepared statements, parameterised queries |
| Database | MySQL | Relational schema, foreign key constraints |
| Icons | Bootstrap Icons 1.11 | UI iconography |

> **Note:** No Node.js, npm, TypeScript, TailwindCSS, AI/ML APIs, or external databases are used. All intelligence is transparent, rule-based, and written in plain JavaScript and PHP.

---

## 📁 Project Folder Structure

```
SkillMesh/
│
├── index.html              # Main entry point – React app + Babel standalone
│
├── css/
│   └── style.css           # Full custom design system (CSS variables, animations)
│
├── js/
│   ├── app.js              # All React components, pages, context, and routing
│   ├── data.js             # Seed sample data for client-side demo mode
│   └── utils.js            # Rule-based algorithms (health score, risk engine, recommendations)
│
├── php/
│   ├── api.php             # REST API endpoints (login, register, projects, requests)
│   ├── db.php              # PDO database connection (loads config.php if present)
│   ├── install.php         # One-click database setup script (creates tables + seeds data)
│   └── config.example.php  # ⬅ Configuration template — copy to config.php and edit
│
├── database/
│   └── schema.sql          # Full MySQL schema + safe fictional seed data
│
├── .gitignore              # Excludes config.php and OS/editor artifacts
└── README.md               # This file
```

---

## ✅ Prerequisites

Before running SkillMesh locally, ensure you have:

| Requirement | Version | Notes |
|-------------|---------|-------|
| Web Browser | Any modern | Chrome, Edge, Firefox, Safari |
| XAMPP **or** WAMP | Latest | For Apache + PHP + MySQL (full-stack mode only) |
| PHP | 8.0+ | Included with XAMPP/WAMP |
| MySQL | 5.7+ / 8.x | Included with XAMPP/WAMP |
| Git | Any | For cloning the repository |

> **Standalone mode** (no backend) requires only a browser — no installation needed.

---

## ⚙️ Installation & Setup

### Step 1 – Clone the Repository

```bash
git clone https://github.com/<your-username>/SkillMesh.git
```

### Step 2 – Place Under Apache Root

Copy or move the `SkillMesh` folder into your Apache web root:

**XAMPP (Windows):**
```
C:\xampp\htdocs\SkillMesh
```

**WAMP (Windows):**
```
C:\wamp64\www\SkillMesh
```

**LAMP (Linux/macOS):**
```
/var/www/html/SkillMesh
```

### Step 3 – Configure Database Credentials

```bash
# From inside the SkillMesh directory:
cp php/config.example.php php/config.php
```

Then open `php/config.php` and set your MySQL credentials:

```php
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');           // ← Set your MySQL password here
define('DB_NAME', 'skillmesh_db');
define('DB_PORTS', [3307, 3306]);
```

> `php/config.php` is listed in `.gitignore` and will never be committed.  
> For standard XAMPP (root user, blank password), the defaults in `config.example.php` work as-is.

---

## 🗄️ MySQL Database Configuration

### Automatic Setup (Recommended)

1. Start **Apache** and **MySQL** in XAMPP / WAMP Control Panel.
2. Open your browser and navigate to:
   ```
   http://localhost/SkillMesh/php/install.php
   ```
3. The installer will automatically:
   - Create the `skillmesh_db` database
   - Create all 7 relational tables with foreign key constraints
   - Insert realistic fictional seed data (6 students, 15 skills, 3 projects)

### Manual Setup

If you prefer to run the SQL manually:

1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Create a new database named `skillmesh_db`
3. Select the database and click **Import**
4. Choose the file `database/schema.sql` and click **Go**

### Schema Overview

```
students              – Student profiles (name, email, department, year, role)
skills                – Master skill catalogue (name, category)
student_skills        – Many-to-many: student ↔ skill with proficiency (1–100)
projects              – Project definitions (name, description, required team size)
project_skills        – Many-to-many: project ↔ skill with required threshold
team_members          – Many-to-many: project ↔ student (active team roster)
collaboration_requests – Invitation messages with accept/reject status
```

---

## 🚀 Running the Project Locally

### Option A – Standalone Browser (Instant Demo, No Backend)

1. Open the `SkillMesh` folder.
2. Double-click `index.html` (or drag it into any browser).
3. The full React SPA launches immediately with in-memory sample data from `js/data.js`.
4. All team health calculations, risk detection, and recommendations work without a server.

> Use this option for a quick demo or when you do not have XAMPP installed.

### Option B – Full-Stack with PHP + MySQL (Persistent Data)

1. Complete the [Installation & Setup](#️-installation--setup) and [Database Configuration](#️-mysql-database-configuration) steps above.
2. Start Apache and MySQL in XAMPP / WAMP.
3. Open:
   ```
   http://localhost/SkillMesh/index.html
   ```
4. Log in with any of the [Demo Accounts](#-demo-accounts) below.

### Option C – PHP Built-in Development Server

If you have PHP installed but not XAMPP, run PHP's built-in server from the `SkillMesh` directory:

```bash
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

> **MySQL must still be running separately** for the PHP API to connect.

---

## 👥 Demo Accounts

All seed accounts share the password **`password123`**.

| Name | Email | Role | Department |
|------|-------|------|------------|
| Arjun Kumar | `arjun@skillmesh.edu` | Frontend Developer | Computer Science |
| Priya Sharma | `priya@skillmesh.edu` | UI/UX Designer | Design |
| Rahul Verma | `rahul@skillmesh.edu` | Domain Expert | Agriculture Engineering |
| Karthik Rajan | `karthik@skillmesh.edu` | Backend Developer | Computer Science |
| Meena Lakshmi | `meena@skillmesh.edu` | Cloud Engineer | Information Technology |
| Sanjay Patel | `sanjay@skillmesh.edu` | Full Stack & ML Developer | Computer Science |

> These are fictional seed accounts created for demonstration and evaluation purposes only.

---

## 📸 Screenshots

> *Add screenshots of your running application here.*  
> Suggested captures:
> - Home / Landing Page with Live Showcase widget
> - Student Dashboard
> - Team Builder with health score breakdown
> - Risk Detection panel
> - Skill Gap Analysis matrix
> - Collaboration Requests inbox

---

## 🧠 Rule-Based Intelligence Algorithms

All analytics are implemented as deterministic, explainable mathematical functions in [`js/utils.js`](js/utils.js). No external AI/ML APIs are used.

### 1. Skill Coverage
For each project-required skill *s*, coverage is the average proficiency of team members who possess it:

```
Coverage(s) = avg( SkillLevel(m, s) ) for all m in team with skill s
If no member has skill s → Coverage(s) = 0%
```

### 2. Team Health Score (0–100 composite)

```
CoverageScore  = avg( min(actual / threshold, 1.0) ) across all required skills
DiversityScore = % of required skills covered by at least one member
DependencyScore = resilience deduction when one member is the sole owner of critical skills

BaseHealth = (CoverageScore × 0.50) + (DiversityScore × 0.30) + (DependencyScore × 0.20)
SizeFactor = 0.75 + 0.25 × min(teamSize / requiredSize, 1.0)
TeamHealth = BaseHealth × SizeFactor
```

### 3. Risk Detection (8 heuristics)

| Code | Severity | Rule |
|------|----------|------|
| R1 | HIGH | Required skill with 0% team coverage |
| R2 | HIGH | Skill coverage below 50% of threshold |
| R3 | MEDIUM | Skill coverage between 50% and 75% of threshold |
| R4 | HIGH | Single member is sole provider of ≥ 2 critical skills |
| R5 | MEDIUM | Single member is sole provider of 1 critical skill |
| R6 | HIGH | Team headcount short by > 2 members |
| R7 | MEDIUM | Team headcount short by 1–2 members |
| R8 | HIGH | Team size < 60% of target with high required skill count |
| R9 | LOW | No high-severity risks detected (balanced team) |

### 4. Peer Recommendation Compatibility

```
Compatibility = (SkillMatch × 0.70) + (RoleMatch × 0.20) + (DomainMatch × 0.10)
```

---

## 🔌 API Endpoints

All endpoints are served from `php/api.php`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `?action=login` | Authenticate student (email + password) |
| `POST` | `?action=register` | Register new student account |
| `GET`  | `?action=get_students` | Retrieve all students with linked skills |
| `GET`  | `?action=get_projects` | Retrieve all projects with skills and team rosters |
| `POST` | `?action=create_project` | Create new project with required skill thresholds |
| `POST` | `?action=toggle_member` | Add or remove a student from a project team |
| `GET`  | `?action=get_requests` | Retrieve all collaboration requests |
| `POST` | `?action=send_request` | Send a collaboration invitation |
| `POST` | `?action=respond_request` | Accept or reject a collaboration request |
| `POST` | `?action=update_profile` | Update student profile fields |
| `POST` | `?action=update_skills` | Replace student skill set |

All responses are JSON:
```json
{ "status": "success|error", "data": { ... }, "message": "..." }
```

---

## 🚧 Limitations & Future Enhancements

### Current Limitations

| # | Limitation | Detail |
|---|-----------|--------|
| 1 | **No session management** | The app stores login state in React memory; page refresh resets the session |
| 2 | **Client-demo mode by default** | The frontend uses `js/data.js` sample data; PHP API integration requires XAMPP setup |
| 3 | **No email verification** | Students can register with any email address |
| 4 | **No file uploads** | Profile avatars use auto-generated colour initials |
| 5 | **Single administrator role** | No admin panel for moderating users or projects |
| 6 | **CORS is open** | `Access-Control-Allow-Origin: *` is acceptable for academic use; restrict for production |
| 7 | **Plain-text demo password fallback** | `api.php` accepts `password123` as a fallback for seed demo accounts |

### Future Enhancements

- **JWT Authentication** – Stateless token-based sessions replacing browser memory storage
- **Real-time notifications** – WebSocket or Server-Sent Events for instant collaboration updates
- **Email integration** – PHPMailer for registration verification and invitation emails
- **Admin dashboard** – Moderation panel for managing students, projects, and requests
- **Profile photos** – File-upload system for avatar images
- **Export functionality** – Download team health reports as PDF
- **Multi-project portfolio** – Allow students to browse and apply to public projects
- **Skill endorsements** – Peer validation of self-reported skill levels
- **Mobile app** – React Native companion app using the existing PHP REST API

---

## 📄 License

This project was created as an individual academic submission for **CS23531 – Web Programming**.  
It is published for educational and portfolio purposes.

---

*Built with ❤️ using HTML, CSS, Bootstrap, JavaScript, React, PHP, and MySQL.*
