<?php
/**
 * SkillMesh – Database Configuration Template
 *
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to php/config.php
 *         cp php/config.example.php php/config.php
 * 2. Edit php/config.php and fill in your actual MySQL credentials.
 * 3. php/config.php is listed in .gitignore and will never be committed.
 *
 * Default XAMPP/WAMP values work for most local setups:
 *   DB_HOST = '127.0.0.1'
 *   DB_USER = 'root'
 *   DB_PASS = ''            ← blank password (XAMPP default)
 *   DB_NAME = 'skillmesh_db'
 */

define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');          // Replace with your MySQL password if set
define('DB_NAME', 'skillmesh_db');
define('DB_PORTS', [3307, 3306]); // XAMPP sometimes runs on 3307; fallback to 3306
