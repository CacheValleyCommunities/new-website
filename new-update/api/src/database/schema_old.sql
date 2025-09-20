-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
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
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
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
);

-- Contributors table
CREATE TABLE IF NOT EXISTS contributors (
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
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
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
);

-- User follows organizations
CREATE TABLE IF NOT EXISTS user_organization_follows (
  user_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, organization_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations (id) ON DELETE CASCADE
);

-- User follows tags
CREATE TABLE IF NOT EXISTS user_tag_follows (
  user_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, tag_id),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- Note: Moderation fields will be added via migration or manual database update
-- For now, we'll handle moderation through application logic

-- Junction table for posts and categories (many-to-many)
CREATE TABLE IF NOT EXISTS post_categories (
  post_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, category_id),
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);

-- Junction table for posts and tags (many-to-many)
CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_date ON organizations(date);
CREATE INDEX IF NOT EXISTS idx_organizations_private ON organizations(private);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date);
CREATE INDEX IF NOT EXISTS idx_posts_private ON posts(private);
CREATE INDEX IF NOT EXISTS idx_posts_weight ON posts(weight);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Follow indexes
CREATE INDEX IF NOT EXISTS idx_user_org_follows_user_id ON user_organization_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_follows_org_id ON user_organization_follows(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_tag_follows_user_id ON user_tag_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tag_follows_tag_id ON user_tag_follows(tag_id);

