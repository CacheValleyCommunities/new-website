import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'

export class Database {
  private db: sqlite3.Database

  constructor(dbPath: string) {
    // Ensure the data directory exists
    const dataDir = path.dirname(dbPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    this.db = new sqlite3.Database(dbPath)
  }

  async initialize(): Promise<void> {
    try {
      // Create tables manually to avoid schema parsing issues
      const tables = [
        `CREATE TABLE IF NOT EXISTS organizations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          description TEXT,
          website TEXT,
          image TEXT,
          date TEXT NOT NULL,
          private BOOLEAN DEFAULT 0,
          type TEXT DEFAULT 'community' CHECK (type IN ('community', 'action', 'political', 'religious', 'business', 'nonprofit', 'educational', 'social', 'other')),
          primary_location TEXT DEFAULT 'remote' CHECK (primary_location IN ('remote', 'address', 'space', 'virtual', 'hybrid')),
          location_address TEXT,
          location_space TEXT,
          about TEXT,
          goals TEXT,
          social_facebook TEXT,
          social_twitter TEXT,
          social_linkedin TEXT,
          social_instagram TEXT,
          social_youtube TEXT,
          discord_url TEXT,
          slack_url TEXT,
          created_by INTEGER,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          moderated_by INTEGER,
          moderated_at DATETIME,
          moderation_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
          FOREIGN KEY (moderated_by) REFERENCES users (id) ON DELETE SET NULL
        )`,
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          date TEXT NOT NULL,
          image TEXT,
          weight INTEGER DEFAULT 0,
          private BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS contributors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          bio TEXT NOT NULL,
          avatar TEXT,
          github TEXT,
          twitter TEXT,
          linkedin TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS users (
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
        )`,
        `CREATE TABLE IF NOT EXISTS user_organization_follows (
          user_id INTEGER NOT NULL,
          organization_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, organization_id),
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS user_tag_follows (
          user_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, tag_id),
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS post_categories (
          post_id INTEGER NOT NULL,
          category_id INTEGER NOT NULL,
          PRIMARY KEY (post_id, category_id),
          FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
          FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS post_tags (
          post_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          PRIMARY KEY (post_id, tag_id),
          FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS invite_codes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          type TEXT DEFAULT 'organization' CHECK (type IN ('organization', 'post')),
          max_uses INTEGER DEFAULT 1,
          used_count INTEGER DEFAULT 0,
          created_by INTEGER,
          expires_at DATETIME,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
        )`
      ]
      
      // Create tables
      for (const table of tables) {
        await this.run(table)
      }
      
      // Create indexes
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug)',
        'CREATE INDEX IF NOT EXISTS idx_organizations_date ON organizations(date)',
        'CREATE INDEX IF NOT EXISTS idx_organizations_private ON organizations(private)',
        'CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)',
        'CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date)',
        'CREATE INDEX IF NOT EXISTS idx_posts_private ON posts(private)',
        'CREATE INDEX IF NOT EXISTS idx_posts_weight ON posts(weight)',
        'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)',
        'CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug)',
        'CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id)',
        'CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id)',
        'CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id)',
        'CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id)',
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
        'CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified)',
        'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)',
        'CREATE INDEX IF NOT EXISTS idx_user_org_follows_user_id ON user_organization_follows(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_user_org_follows_org_id ON user_organization_follows(organization_id)',
        'CREATE INDEX IF NOT EXISTS idx_user_tag_follows_user_id ON user_tag_follows(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_user_tag_follows_tag_id ON user_tag_follows(tag_id)',
        'CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type)',
        'CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status)',
        'CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by)',
        'CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code)',
        'CREATE INDEX IF NOT EXISTS idx_invite_codes_type ON invite_codes(type)',
        'CREATE INDEX IF NOT EXISTS idx_invite_codes_active ON invite_codes(is_active)'
      ]
      
      for (const index of indexes) {
        await this.run(index)
      }
      
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  async run(sql: string, params?: any[]): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params || [], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve(this)
        }
      })
    })
  }

  async get(sql: string, params?: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params || [], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  async all(sql: string, params?: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params || [], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // Helper method for transactions
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.run('BEGIN TRANSACTION')
    try {
      const result = await callback()
      await this.run('COMMIT')
      return result
    } catch (error) {
      await this.run('ROLLBACK')
      throw error
    }
  }
}

// Create database instance
const dbPath = process.env.DATABASE_PATH || './data/database.sqlite'
export const database = new Database(dbPath)
