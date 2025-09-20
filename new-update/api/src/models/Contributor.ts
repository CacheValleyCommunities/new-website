import { database } from '../database'
import { Contributor } from '../types'

export class ContributorModel {
  static async findAll(): Promise<Contributor[]> {
    const sql = 'SELECT * FROM contributors ORDER BY created_at DESC'
    return database.all(sql)
  }

  static async findById(id: number): Promise<Contributor | null> {
    const sql = 'SELECT * FROM contributors WHERE id = ?'
    return database.get(sql, [id])
  }

  static async create(data: Omit<Contributor, 'id' | 'created_at' | 'updated_at'>): Promise<Contributor> {
    const sql = `
      INSERT INTO contributors (name, role, bio, avatar, github, twitter, linkedin)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const result = await database.run(sql, [
      data.name,
      data.role,
      data.bio,
      data.avatar || null,
      data.github || null,
      data.twitter || null,
      data.linkedin || null
    ])
    
    const contributor = await this.findById(result.lastID)
    return contributor!
  }

  static async update(id: number, data: Partial<Omit<Contributor, 'id' | 'created_at' | 'updated_at'>>): Promise<Contributor | null> {
    const fields = []
    const values = []
    
    if (data.name !== undefined) {
      fields.push('name = ?')
      values.push(data.name)
    }
    if (data.role !== undefined) {
      fields.push('role = ?')
      values.push(data.role)
    }
    if (data.bio !== undefined) {
      fields.push('bio = ?')
      values.push(data.bio)
    }
    if (data.avatar !== undefined) {
      fields.push('avatar = ?')
      values.push(data.avatar)
    }
    if (data.github !== undefined) {
      fields.push('github = ?')
      values.push(data.github)
    }
    if (data.twitter !== undefined) {
      fields.push('twitter = ?')
      values.push(data.twitter)
    }
    if (data.linkedin !== undefined) {
      fields.push('linkedin = ?')
      values.push(data.linkedin)
    }
    
    if (fields.length === 0) {
      return this.findById(id)
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const sql = `UPDATE contributors SET ${fields.join(', ')} WHERE id = ?`
    await database.run(sql, values)
    
    return this.findById(id)
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM contributors WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }
}
