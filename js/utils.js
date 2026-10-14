// ============================================================
// SkillMesh – Utility & Calculation Functions
// CS23531 Web Programming Project
//
// NOTE: All intelligence is rule-based JavaScript.
//       No AI, ML, or external APIs are used.
// ============================================================

/**
 * Helper to match skill names with aliases (e.g., Agriculture vs Agriculture Domain)
 */
function isSkillMatch(s1, s2) {
  if (!s1 || !s2) return false;
  var a = s1.trim().toLowerCase();
  var b = s2.trim().toLowerCase();
  if (a === b) return true;
  if ((a === "agriculture" && b === "agriculture domain") || (b === "agriculture" && a === "agriculture domain")) return true;
  return false;
}

/**
 * Calculate skill coverage % for a required skill across team members.
 * Rule: Compares team members' skill levels and aggregates coverage across the team.
 *
 * @param {string} skillName
 * @param {Array}  teamMembers
 * @returns {number} 0-100
 */
function calculateSkillCoverage(skillName, teamMembers) {
  if (!teamMembers || teamMembers.length === 0) return 0;

  var relevant = teamMembers.filter(function(m) {
    return m.skills && m.skills.some(function(s) {
      return isSkillMatch(s.name, skillName);
    });
  });

  if (relevant.length === 0) return 0;

  var total = relevant.reduce(function(sum, m) {
    var sk = m.skills.find(function(s) {
      return isSkillMatch(s.name, skillName);
    });
    return sum + (sk ? sk.level : 0);
  }, 0);

  return Math.round(total / relevant.length);
}

/**
 * Calculate detailed breakdown of Team Health.
 *
 * Components (Pure Rule-Based Algorithm, Transparent):
 *   1. Skill Coverage Score (50%): Average coverage relative to required thresholds.
 *   2. Skill Diversity Score (30%): Proportion of required skills covered by the team.
 *   3. Dependency Balance Score (20%): Resilience against single-member bottlenecks.
 *   4. Team Size Factor: Multiplier based on headcount adequacy.
 *
 * @param {Object} project
 * @param {Array}  teamMembers
 * @returns {{ health: number, coverageScore: number, diversityScore: number, dependencyScore: number, sizeFactor: number }}
 */
function calculateTeamHealthBreakdown(project, teamMembers) {
  if (!project || !teamMembers || teamMembers.length === 0) {
    return { health: 0, coverageScore: 0, diversityScore: 0, dependencyScore: 0, sizeFactor: 0 };
  }

  var reqSkills = project.required_skills || [];
  if (reqSkills.length === 0) return { health: 0, coverageScore: 0, diversityScore: 0, dependencyScore: 0, sizeFactor: 0 };

  // 1. Skill Coverage relative to required levels
  var coverageRatios = reqSkills.map(function(rs) {
    var cov = calculateSkillCoverage(rs.name, teamMembers);
    var target = rs.required_level || 70;
    return Math.min(cov / target, 1.0);
  });
  var coverageScore = Math.round((coverageRatios.reduce(function(a, b) { return a + b; }, 0) / coverageRatios.length) * 100);

  // 2. Skill Diversity (breadth of required skills covered by at least 1 person)
  var coveredCount = reqSkills.filter(function(rs) {
    return calculateSkillCoverage(rs.name, teamMembers) > 0;
  }).length;
  var diversityScore = Math.round((coveredCount / reqSkills.length) * 100);

  // 3. Dependency Balance (penalty for single member bottlenecks)
  var singleDeps = 0;
  teamMembers.forEach(function(member) {
    var uniqueSkills = reqSkills.filter(function(rs) {
      var memberHas = member.skills && member.skills.some(function(s) { return isSkillMatch(s.name, rs.name) && s.level >= 50; });
      if (!memberHas) return false;
      var othersHave = teamMembers.filter(function(m) { return m.id !== member.id; }).some(function(m) {
        return m.skills && m.skills.some(function(s) { return isSkillMatch(s.name, rs.name) && s.level >= 50; });
      });
      return !othersHave;
    });
    if (uniqueSkills.length > 0) singleDeps += uniqueSkills.length;
  });
  var dependencyScore = Math.max(20, Math.min(100, 100 - (singleDeps * 15)));

  // 4. Team Size Factor
  var reqSize = project.required_team_size || 4;
  var sizeFactor = Math.min(teamMembers.length / reqSize, 1.0);

  // Weighted Health Calculation
  var baseHealth = (coverageScore * 0.50) + (diversityScore * 0.30) + (dependencyScore * 0.20);
  var adjustedHealth = baseHealth * (0.75 + 0.25 * sizeFactor);
  var health = Math.max(0, Math.min(100, Math.round(adjustedHealth)));

  return {
    health: health,
    coverageScore: coverageScore,
    diversityScore: diversityScore,
    dependencyScore: dependencyScore,
    sizeFactor: Math.round(sizeFactor * 100)
  };
}

/**
 * Calculate overall Team Health Score (0-100) using transparent rule-based metrics.
 */
function calculateTeamHealth(project, teamMembers) {
  return calculateTeamHealthBreakdown(project, teamMembers).health;
}

/**
 * Return status label and Bootstrap color class for a coverage value.
 *
 * @param {number} coverage  actual %
 * @param {number} required  required %
 * @returns {{ label: string, cls: string, variant: string }}
 */
function getSkillStatus(coverage, required) {
  if (coverage >= required)              return { label: "GOOD",     cls: "success", variant: "success" };
  if (coverage >= required * 0.65)       return { label: "WARNING",  cls: "warning", variant: "warning" };
  if (coverage > 0)                      return { label: "CRITICAL", cls: "danger",  variant: "danger"  };
  return                                        { label: "MISSING",  cls: "dark",    variant: "dark"    };
}

/**
 * Detect project risks using rule-based logic.
 *
 * Rules applied:
 *  R1 – Missing Skill:       coverage = 0          → HIGH
 *  R2 – Critical Skill Gap:  coverage < 50%         → HIGH
 *  R3 – Moderate Skill Gap:  coverage < required    → MEDIUM
 *  R4 – Single Dependency:   1 member owns ≥2 critical skills → HIGH
 *  R5 – Single Dependency:   1 member owns 1 unique critical  → MEDIUM
 *  R6 – Team Size (large shortage):  missing > 2   → HIGH
 *  R7 – Team Size (small shortage):  missing 1-2   → MEDIUM
 *  R8 – Workload:            team < 60% of required → HIGH
 *  R9 – Balanced:            no HIGH risks found   → LOW
 *
 * @param {Object} project
 * @param {Array}  teamMembers
 * @returns {Array<{type,severity,description,recommendation,icon}>}
 */
function detectRisks(project, teamMembers) {
  var risks = [];
  if (!project) return risks;

  // R1 & R2 & R3 – Skill coverage risks
  project.required_skills.forEach(function(rs) {
    var cov = calculateSkillCoverage(rs.name, teamMembers);
    if (cov === 0) {
      risks.push({
        type: "Missing Skill Risk",
        severity: "HIGH",
        description: 'No team member has the "' + rs.name + '" skill. This is a critical gap.',
        recommendation: "Immediately recruit a student with " + rs.name + " expertise.",
        icon: "bi-exclamation-octagon-fill"
      });
    } else if (cov < rs.required_level * 0.5) {
      risks.push({
        type: "Skill Gap Risk",
        severity: "HIGH",
        description: '"' + rs.name + '" coverage is critically low (' + cov + '%). Required: ' + rs.required_level + '%.',
        recommendation: "Add a skilled " + rs.name + " specialist to significantly raise coverage.",
        icon: "bi-graph-down-arrow"
      });
    } else if (cov < rs.required_level) {
      risks.push({
        type: "Skill Gap Risk",
        severity: "MEDIUM",
        description: '"' + rs.name + '" coverage (' + cov + '%) is below the required ' + rs.required_level + '%.',
        recommendation: "Consider adding a " + rs.name + " member or upskilling the current team.",
        icon: "bi-exclamation-triangle-fill"
      });
    }
  });

  // R4 & R5 – Single Member Dependency
  teamMembers.forEach(function(member) {
    var uniqueCritical = project.required_skills.filter(function(rs) {
      var memberSkill = member.skills.find(function(s) {
        return isSkillMatch(s.name, rs.name);
      });
      if (!memberSkill || memberSkill.level < 60) return false;

      var othersHaveIt = teamMembers.filter(function(m) { return m.id !== member.id; })
        .some(function(m) {
          return m.skills.some(function(s) {
            return isSkillMatch(s.name, rs.name) && s.level >= 50;
          });
        });
      return !othersHaveIt;
    });

    if (uniqueCritical.length >= 2) {
      risks.push({
        type: "Single Member Dependency",
        severity: "HIGH",
        description: member.name + " is the sole contributor for " + uniqueCritical.length +
          " critical skills: " + uniqueCritical.map(function(s) { return s.name; }).join(", ") + ".",
        recommendation: "Add a backup member with overlapping skills to reduce dependency on " + member.name + ".",
        icon: "bi-person-exclamation"
      });
    } else if (uniqueCritical.length === 1) {
      risks.push({
        type: "Single Member Dependency",
        severity: "MEDIUM",
        description: member.name + ' is the only team member with "' + uniqueCritical[0].name + '".',
        recommendation: "Consider adding backup skill coverage for " + uniqueCritical[0].name + ".",
        icon: "bi-person-exclamation"
      });
    }
  });

  // R6 & R7 – Team Size
  if (teamMembers.length < project.required_team_size) {
    var shortage = project.required_team_size - teamMembers.length;
    risks.push({
      type: "Team Size Risk",
      severity: shortage > 2 ? "HIGH" : "MEDIUM",
      description: "Team has " + teamMembers.length + " member(s) but the project requires " +
        project.required_team_size + ". Short by " + shortage + " member(s).",
      recommendation: "Recruit " + shortage + " more student(s) to meet the required team size.",
      icon: "bi-people-fill"
    });
  }

  // R8 – Workload Risk
  if (teamMembers.length > 0 && teamMembers.length < project.required_team_size * 0.6) {
    risks.push({
      type: "Workload Risk",
      severity: "HIGH",
      description: "With only " + teamMembers.length + " member(s) covering " +
        project.required_skills.length + " required skills, existing members may face excessive workload.",
      recommendation: "Expand the team significantly to distribute responsibilities more evenly.",
      icon: "bi-lightning-charge-fill"
    });
  }

  // R9 – Balanced Team (only if no HIGH risks)
  var hasHighRisk = risks.some(function(r) { return r.severity === "HIGH"; });
  if (!hasHighRisk) {
    risks.push({
      type: "Balanced Team",
      severity: "LOW",
      description: "All major skill areas have adequate coverage and the team composition looks balanced.",
      recommendation: "Maintain the current team. Continue monitoring as project requirements evolve.",
      icon: "bi-check-circle-fill"
    });
  }

  return risks;
}

/**
 * Calculate a compatibility score for a student against missing skills.
 *
 * Transparent formula (no AI/ML):
 *   Skill Match   = 70% weight  – how well student covers missing skills
 *   Role Match    = 20% weight  – whether student's role aligns
 *   Domain Match  = 10% weight  – department/domain relevance
 *
 * @param {Object} student
 * @param {Array}  missingSkills  [{name, required_level}]
 * @returns {number} 0-100
 */
function calculateCompatibility(student, missingSkills) {
  if (!missingSkills || missingSkills.length === 0) return 0;

  // Skill Match
  var skillTotal = 0;
  missingSkills.forEach(function(ms) {
    var sk = student.skills.find(function(s) {
      return isSkillMatch(s.name, ms.name);
    });
    skillTotal += sk ? sk.level : 0;
  });
  var skillScore = skillTotal / missingSkills.length;

  // Role Match
  var roleLower = (student.role || "").toLowerCase();
  var roleRelated = missingSkills.some(function(ms) {
    var first = ms.name.toLowerCase().split(" ")[0];
    return roleLower.includes(first) || first.includes(roleLower.split(" ")[0]);
  });
  var roleScore = roleRelated ? 95 : 50;

  // Domain Match
  var deptLower = (student.department || "").toLowerCase();
  var domainRelated = missingSkills.some(function(ms) {
    var first = ms.name.toLowerCase().split(" ")[0];
    return deptLower.includes(first);
  });
  var domainScore = domainRelated ? 100 : (deptLower.includes("computer") || deptLower.includes("information") ? 70 : 40);

  var compat = Math.round(skillScore * 0.70 + roleScore * 0.20 + domainScore * 0.10);
  return Math.max(0, Math.min(100, compat));
}

/**
 * Find and rank recommended students for weak/missing skills.
 *
 * @param {Object} project
 * @param {Array}  currentTeamIds  array of student IDs already in team
 * @param {Array}  allStudents
 * @returns {Array} candidates sorted by compatibility desc
 */
function getRecommendations(project, currentTeamIds, allStudents) {
  if (!project) return [];

  var currentTeam = allStudents.filter(function(s) {
    return currentTeamIds.indexOf(s.id) !== -1;
  });

  // Collect skills that need improvement
  var weakSkills = project.required_skills.filter(function(rs) {
    return calculateSkillCoverage(rs.name, currentTeam) < rs.required_level;
  });

  var candidates = allStudents.filter(function(s) {
    return currentTeamIds.indexOf(s.id) === -1;
  });

  var results = candidates.map(function(student) {
    var coversSkills = weakSkills.filter(function(ws) {
      return student.skills.some(function(s) {
        return isSkillMatch(s.name, ws.name) && s.level >= 50;
      });
    });
    return {
      student: student,
      compatibility: calculateCompatibility(student, weakSkills),
      coversSkills: coversSkills
    };
  }).filter(function(r) { return r.coversSkills.length > 0; })
    .sort(function(a, b) { return b.compatibility - a.compatibility; });

  return results;
}

// ── Form Validation ────────────────────────────────────────────

function validateLoginForm(email, password) {
  var errors = {};
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

function validateRegisterForm(data) {
  var errors = {};
  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (data.password !== data.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }
  if (!data.department) errors.department = "Please select your department.";
  if (!data.year)       errors.year = "Please select your year.";
  if (!data.role)       errors.role = "Please select your role.";
  return errors;
}

function validateProjectForm(data) {
  var errors = {};
  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Project name must be at least 3 characters.";
  }
  if (!data.description || data.description.trim().length < 20) {
    errors.description = "Please provide a description of at least 20 characters.";
  }
  if (!data.category) errors.category = "Please select a project category.";
  if (!data.required_team_size || parseInt(data.required_team_size) < 2) {
    errors.required_team_size = "Required team size must be at least 2.";
  }
  if (!data.required_skills || data.required_skills.length === 0) {
    errors.required_skills = "Select at least one required skill.";
  }
  return errors;
}

// ── Helper Utilities ───────────────────────────────────────────

function getInitials(name) {
  return (name || "?").split(" ").map(function(w) { return w[0]; }).join("").toUpperCase().slice(0, 2);
}

function getRiskSeverityOrder(severity) {
  return severity === "HIGH" ? 0 : severity === "MEDIUM" ? 1 : 2;
}

function sortRisksByPriority(risks) {
  return risks.slice().sort(function(a, b) {
    return getRiskSeverityOrder(a.severity) - getRiskSeverityOrder(b.severity);
  });
}

function getHealthLabel(score) {
  if (score >= 80) return { label: "Excellent", cls: "success" };
  if (score >= 65) return { label: "Good",      cls: "primary" };
  if (score >= 45) return { label: "Fair",      cls: "warning" };
  return                  { label: "Poor",      cls: "danger"  };
}

function getProgressBarColor(pct, required) {
  if (pct >= required)          return "bg-success";
  if (pct >= required * 0.65)   return "bg-warning";
  return "bg-danger";
}
