const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

async function createSimpleDatabase() {
    const dbPath = './data/database.sqlite';

    // Remove existing database
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
    }

    // Create data directory
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const db = new sqlite3.Database(dbPath);

    try {
        console.log('Creating database tables...');

        // Create organizations table
        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        summary TEXT NOT NULL,
        description TEXT,
        website TEXT,
        image TEXT,
        date TEXT NOT NULL,
        private BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        console.log('Organizations table created');

        // Create users table
        await new Promise((resolve, reject) => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        avatar TEXT,
        bio TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
        email_verified BOOLEAN DEFAULT 0,
        email_verification_token TEXT,
        password_reset_token TEXT,
        password_reset_expires DATETIME,
        last_login DATETIME,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        console.log('Users table created');

        // Test inserting a user
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO users (email, password_hash, first_name, last_name) 
              VALUES ('test@example.com', 'hashedpassword', 'Test', 'User')`, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });

        console.log('Test user inserted');

        // Test querying
        await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', ['test@example.com'], (err, row) => {
                if (err) reject(err);
                else {
                    console.log('Test user found:', row);
                    resolve(row);
                }
            });
        });

        console.log('Database test successful!');

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        db.close();
    }
}

createSimpleDatabase();
