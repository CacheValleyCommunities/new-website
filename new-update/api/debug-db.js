const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

async function testDatabaseInit() {
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
        console.log('Testing database initialization...');

        // Read schema
        const schemaPath = path.join(__dirname, 'src/database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split into statements
        const statements = schema.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));

        console.log(`Found ${statements.length} statements to execute`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);

                await new Promise((resolve, reject) => {
                    db.run(statement, function (err) {
                        if (err) {
                            console.error(`Error in statement ${i + 1}:`, err);
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    });
                });
            }
        }

        console.log('Database initialization successful!');

        // Test a simple query
        await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Tables created successfully');
                    resolve(row);
                }
            });
        });

    } catch (error) {
        console.error('Database initialization failed:', error);
    } finally {
        db.close();
    }
}

testDatabaseInit();
