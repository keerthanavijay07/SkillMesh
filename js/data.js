// ============================================================
// SkillMesh – Sample Data
// CS23531 Web Programming Project
// ============================================================

// Skill level numeric mapping
var SKILL_LEVELS = {
  Beginner: 25,
  Intermediate: 55,
  Advanced: 80,
  Expert: 95
};

// Available skill options for project/profile
var AVAILABLE_SKILLS = [
  "Frontend", "Backend", "Database", "JavaScript", "ReactJS", "PHP",
  "UI/UX", "Machine Learning", "Cloud", "Agriculture Domain", "Python",
  "DevOps", "Figma", "MySQL", "APIs", "Data Analysis", "Research",
  "AWS", "Docker", "HTML/CSS", "Android", "iOS", "Cybersecurity"
];

// Project category options
var PROJECT_CATEGORIES = [
  "AgriTech", "EdTech", "HealthTech", "FinTech", "E-Commerce",
  "Social Platform", "IoT", "Data Science", "Mobile App", "Web App", "Other"
];

// Department options
var DEPARTMENTS = [
  "Computer Science", "Information Technology", "Electronics & Communication",
  "Agriculture Engineering", "Mechanical Engineering", "Design", "Business"
];

// Year options
var YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// Role options
var ROLE_OPTIONS = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "UI/UX Designer", "Database Administrator", "ML Engineer",
  "Cloud Engineer", "DevOps Engineer", "Domain Expert", "Project Manager"
];

// ── Sample Students ──────────────────────────────────────────
var SAMPLE_STUDENTS = [
  {
    id: 1,
    name: "Arjun Kumar",
    initials: "AK",
    student_id: "CS21001",
    department: "Computer Science",
    year: "3rd Year",
    role: "Frontend Developer",
    email: "arjun@skillmesh.edu",
    avatar_color: "#1a6cf6",
    skills: [
      { name: "Frontend",    level: 92, levelLabel: "Expert"       },
      { name: "ReactJS",     level: 88, levelLabel: "Advanced"     },
      { name: "JavaScript",  level: 90, levelLabel: "Expert"       },
      { name: "HTML/CSS",    level: 95, levelLabel: "Expert"       },
      { name: "Backend",     level: 65, levelLabel: "Intermediate" },
      { name: "UI/UX",       level: 50, levelLabel: "Intermediate" }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    student_id: "DS21015",
    department: "Design",
    year: "3rd Year",
    role: "UI/UX Designer",
    email: "priya@skillmesh.edu",
    avatar_color: "#9c27b0",
    skills: [
      { name: "UI/UX",       level: 92, levelLabel: "Expert"   },
      { name: "Figma",       level: 90, levelLabel: "Expert"   },
      { name: "Frontend",    level: 75, levelLabel: "Advanced" },
      { name: "Prototyping", level: 88, levelLabel: "Advanced" },
      { name: "JavaScript",  level: 50, levelLabel: "Intermediate" }
    ]
  },
  {
    id: 3,
    name: "Rahul Verma",
    initials: "RV",
    student_id: "AE21032",
    department: "Agriculture Engineering",
    year: "4th Year",
    role: "Domain Expert",
    email: "rahul@skillmesh.edu",
    avatar_color: "#2e7d32",
    skills: [
      { name: "Agriculture",        level: 90, levelLabel: "Expert"   },
      { name: "Agriculture Domain", level: 90, levelLabel: "Expert"   },
      { name: "Research",           level: 85, levelLabel: "Advanced" },
      { name: "Python",             level: 60, levelLabel: "Advanced" },
      { name: "Data Analysis",      level: 72, levelLabel: "Advanced" },
      { name: "Machine Learning",   level: 55, levelLabel: "Intermediate" }
    ]
  },
  {
    id: 4,
    name: "Karthik Rajan",
    initials: "KR",
    student_id: "CS21008",
    department: "Computer Science",
    year: "4th Year",
    role: "Backend Developer",
    email: "karthik@skillmesh.edu",
    avatar_color: "#e65100",
    skills: [
      { name: "Backend",  level: 94, levelLabel: "Expert"   },
      { name: "PHP",      level: 90, levelLabel: "Expert"   },
      { name: "Database", level: 92, levelLabel: "Expert"   },
      { name: "MySQL",    level: 88, levelLabel: "Advanced" },
      { name: "APIs",     level: 82, levelLabel: "Advanced" }
    ]
  },
  {
    id: 5,
    name: "Meena Lakshmi",
    initials: "ML",
    student_id: "IT21044",
    department: "Information Technology",
    year: "4th Year",
    role: "Cloud Engineer",
    email: "meena@skillmesh.edu",
    avatar_color: "#00838f",
    skills: [
      { name: "Cloud",    level: 88, levelLabel: "Advanced" },
      { name: "Backend",  level: 75, levelLabel: "Advanced" },
      { name: "DevOps",   level: 80, levelLabel: "Advanced" },
      { name: "AWS",      level: 82, levelLabel: "Advanced" },
      { name: "Database", level: 65, levelLabel: "Advanced" }
    ]
  },
  {
    id: 6,
    name: "Sanjay Patel",
    initials: "SP",
    student_id: "CS21022",
    department: "Computer Science",
    year: "3rd Year",
    role: "Full Stack & ML Developer",
    email: "sanjay@skillmesh.edu",
    avatar_color: "#6a1b9a",
    skills: [
      { name: "Frontend",         level: 75, levelLabel: "Advanced"     },
      { name: "Database",         level: 70, levelLabel: "Advanced"     },
      { name: "UI/UX",            level: 65, levelLabel: "Advanced"     },
      { name: "Machine Learning", level: 85, levelLabel: "Advanced"     },
      { name: "Python",           level: 80, levelLabel: "Advanced"     }
    ]
  },
  {
    id: 7,
    name: "Ananya Singh",
    initials: "AS",
    student_id: "CS22005",
    department: "Computer Science",
    year: "2nd Year",
    role: "Full Stack Developer",
    email: "ananya@skillmesh.edu",
    avatar_color: "#d81b60",
    skills: [
      { name: "Frontend",   level: 80, levelLabel: "Advanced" },
      { name: "Backend",    level: 76, levelLabel: "Advanced" },
      { name: "JavaScript", level: 82, levelLabel: "Advanced" },
      { name: "ReactJS",    level: 72, levelLabel: "Advanced" },
      { name: "Database",   level: 68, levelLabel: "Advanced" }
    ]
  },
  {
    id: 8,
    name: "Vikram Nair",
    initials: "VN",
    student_id: "IT21011",
    department: "Information Technology",
    year: "3rd Year",
    role: "Database Administrator",
    email: "vikram@skillmesh.edu",
    avatar_color: "#0277bd",
    skills: [
      { name: "Database",     level: 95, levelLabel: "Expert"   },
      { name: "MySQL",        level: 92, levelLabel: "Expert"   },
      { name: "Backend",      level: 70, levelLabel: "Advanced" },
      { name: "PHP",          level: 65, levelLabel: "Advanced" },
      { name: "Data Analysis",level: 75, levelLabel: "Advanced" }
    ]
  }
];

// ── Sample Projects ───────────────────────────────────────────
var SAMPLE_PROJECTS = [
  {
    id: 1,
    name: "Smart Agriculture Platform",
    description: "An IoT-based platform for smart farming with real-time sensor monitoring, crop health tracking, automated irrigation control, and yield prediction using rule-based analysis.",
    category: "AgriTech",
    required_team_size: 5,
    status: "Active",
    created_by: 1,
    required_skills: [
      { name: "Frontend",         required_level: 70 },
      { name: "Backend",          required_level: 75 },
      { name: "Database",         required_level: 70 },
      { name: "Machine Learning", required_level: 60 },
      { name: "UI/UX",            required_level: 65 },
      { name: "Agriculture",      required_level: 70 },
      { name: "Cloud",            required_level: 60 }
    ],
    team_members: [1, 4, 6]
  },
  {
    id: 2,
    name: "Campus Event Management System",
    description: "A full-stack web application to manage college events, student registrations, volunteer coordination, and post-event feedback collection.",
    category: "EdTech",
    required_team_size: 4,
    status: "Planning",
    created_by: 1,
    required_skills: [
      { name: "Frontend",  required_level: 70 },
      { name: "Backend",   required_level: 70 },
      { name: "Database",  required_level: 65 },
      { name: "UI/UX",     required_level: 60 },
      { name: "JavaScript",required_level: 65 }
    ],
    team_members: [1, 2, 4]
  },
  {
    id: 3,
    name: "Student Health Tracker",
    description: "A web portal helping students log daily health metrics, get wellness tips, and track their mental and physical wellbeing throughout the semester.",
    category: "HealthTech",
    required_team_size: 4,
    status: "Planning",
    created_by: 7,
    required_skills: [
      { name: "Frontend",  required_level: 65 },
      { name: "Backend",   required_level: 70 },
      { name: "Database",  required_level: 65 },
      { name: "UI/UX",     required_level: 70 },
      { name: "Data Analysis", required_level: 55 }
    ],
    team_members: [7, 2]
  }
];

// ── Collaboration Requests (sample) ───────────────────────────
var SAMPLE_REQUESTS = [
  {
    id: 1,
    from_student_id: 2,
    to_student_id: 1,
    project_id: 1,
    message: "Hi Arjun! I saw your team needs a UI/UX designer for the Smart Agriculture Platform. I have strong Figma and prototyping skills. Would love to join!",
    status: "pending",
    date: "2026-10-05"
  },
  {
    id: 2,
    from_student_id: 5,
    to_student_id: 1,
    project_id: 1,
    message: "Hello! I specialise in Cloud & DevOps. I noticed your project needs cloud coverage. Happy to contribute.",
    status: "accepted",
    date: "2026-10-04"
  },
  {
    id: 3,
    from_student_id: 1,
    to_student_id: 3,
    project_id: 1,
    message: "Hey Rahul, our Smart Agriculture project urgently needs an Agriculture Domain expert. Would you be interested?",
    status: "pending",
    date: "2026-10-05"
  }
];
