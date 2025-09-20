import { database } from '../database'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export interface User {
  id: number
  email: string
  password_hash: string
  first_name: string
  last_name: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  email_verified: boolean
  email_verification_token?: string
  password_reset_token?: string
  password_reset_expires?: string
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  first_name: string
  last_name: string
  bio?: string
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  bio?: string
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export class UserModel {
  private static readonly SALT_ROUNDS = 12
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

  static async create(data: CreateUserData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, this.SALT_ROUNDS)
    const emailVerificationToken = crypto.randomBytes(32).toString('hex')

    const sql = `
      INSERT INTO users (email, password_hash, first_name, last_name, bio, email_verification_token)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    
    const result = await database.run(sql, [
      data.email.toLowerCase(),
      passwordHash,
      data.first_name,
      data.last_name,
      data.bio || null,
      emailVerificationToken
    ])
    
    const user = await this.findById(result.lastID)
    return user!
  }

  static async findById(id: number): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = ?'
    return database.get(sql, [id])
  }

  static async findByEmail(email: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email = ?'
    return database.get(sql, [email.toLowerCase()])
  }

  static async findByEmailVerificationToken(token: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE email_verification_token = ?'
    return database.get(sql, [token])
  }

  static async findByPasswordResetToken(token: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > CURRENT_TIMESTAMP'
    return database.get(sql, [token])
  }

  static async update(id: number, data: UpdateUserData): Promise<User | null> {
    const fields = []
    const values = []
    
    if (data.first_name !== undefined) {
      fields.push('first_name = ?')
      values.push(data.first_name)
    }
    if (data.last_name !== undefined) {
      fields.push('last_name = ?')
      values.push(data.last_name)
    }
    if (data.bio !== undefined) {
      fields.push('bio = ?')
      values.push(data.bio)
    }
    if (data.avatar !== undefined) {
      fields.push('avatar = ?')
      values.push(data.avatar)
    }
    
    if (fields.length === 0) {
      return this.findById(id)
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
    await database.run(sql, values)
    
    return this.findById(id)
  }

  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const passwordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS)
    
    const sql = `
      UPDATE users 
      SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const result = await database.run(sql, [passwordHash, id])
    return result.changes! > 0
  }

  static async verifyEmail(id: number): Promise<boolean> {
    const sql = `
      UPDATE users 
      SET email_verified = 1, email_verification_token = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }

  static async setPasswordResetToken(email: string): Promise<string | null> {
    const user = await this.findByEmail(email)
    if (!user) return null

    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour

    const sql = `
      UPDATE users 
      SET password_reset_token = ?, password_reset_expires = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    
    await database.run(sql, [token, expires.toISOString(), user.id])
    return token
  }

  static async updateLastLogin(id: number): Promise<void> {
    const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?'
    await database.run(sql, [id])
  }

  static async deactivate(id: number): Promise<boolean> {
    const sql = 'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }

  static async activate(id: number): Promise<boolean> {
    const sql = 'UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }

  static async changeRole(id: number, role: 'user' | 'admin' | 'moderator'): Promise<boolean> {
    const sql = 'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    const result = await database.run(sql, [role, id])
    return result.changes! > 0
  }

  static async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    const sql = `
      SELECT id, email, first_name, last_name, avatar, bio, role, email_verified, 
             last_login, is_active, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `
    return database.all(sql, [limit, offset])
  }

  static async getUsersByRole(role: 'user' | 'admin' | 'moderator'): Promise<User[]> {
    const sql = `
      SELECT id, email, first_name, last_name, avatar, bio, role, email_verified, 
             last_login, is_active, created_at, updated_at
      FROM users 
      WHERE role = ?
      ORDER BY created_at DESC
    `
    return database.all(sql, [role])
  }

  static async searchUsers(query: string): Promise<User[]> {
    const sql = `
      SELECT id, email, first_name, last_name, avatar, bio, role, email_verified, 
             last_login, is_active, created_at, updated_at
      FROM users 
      WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
      AND is_active = 1
      ORDER BY created_at DESC
    `
    const searchTerm = `%${query}%`
    return database.all(sql, [searchTerm, searchTerm, searchTerm])
  }

  // Follow methods
  static async followOrganization(userId: number, organizationId: number): Promise<boolean> {
    try {
      const sql = 'INSERT INTO user_organization_follows (user_id, organization_id) VALUES (?, ?)'
      await database.run(sql, [userId, organizationId])
      return true
    } catch (error) {
      // Likely a duplicate entry, which means already following
      return false
    }
  }

  static async unfollowOrganization(userId: number, organizationId: number): Promise<boolean> {
    const sql = 'DELETE FROM user_organization_follows WHERE user_id = ? AND organization_id = ?'
    const result = await database.run(sql, [userId, organizationId])
    return result.changes! > 0
  }

  static async followTag(userId: number, tagId: number): Promise<boolean> {
    try {
      const sql = 'INSERT INTO user_tag_follows (user_id, tag_id) VALUES (?, ?)'
      await database.run(sql, [userId, tagId])
      return true
    } catch (error) {
      // Likely a duplicate entry, which means already following
      return false
    }
  }

  static async unfollowTag(userId: number, tagId: number): Promise<boolean> {
    const sql = 'DELETE FROM user_tag_follows WHERE user_id = ? AND tag_id = ?'
    const result = await database.run(sql, [userId, tagId])
    return result.changes! > 0
  }

  static async getFollowedOrganizations(userId: number): Promise<any[]> {
    const sql = `
      SELECT o.* FROM organizations o
      INNER JOIN user_organization_follows uof ON o.id = uof.organization_id
      WHERE uof.user_id = ?
      ORDER BY uof.created_at DESC
    `
    return database.all(sql, [userId])
  }

  static async getFollowedTags(userId: number): Promise<any[]> {
    const sql = `
      SELECT t.* FROM tags t
      INNER JOIN user_tag_follows utf ON t.id = utf.tag_id
      WHERE utf.user_id = ?
      ORDER BY utf.created_at DESC
    `
    return database.all(sql, [userId])
  }

  static async isFollowingOrganization(userId: number, organizationId: number): Promise<boolean> {
    const sql = 'SELECT 1 FROM user_organization_follows WHERE user_id = ? AND organization_id = ?'
    const result = await database.get(sql, [userId, organizationId])
    return !!result
  }

  static async isFollowingTag(userId: number, tagId: number): Promise<boolean> {
    const sql = 'SELECT 1 FROM user_tag_follows WHERE user_id = ? AND tag_id = ?'
    const result = await database.get(sql, [userId, tagId])
    return !!result
  }
}
