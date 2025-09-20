import { database } from '../database'
import { Tag } from '../types'

export class TagModel {
  static async findAll(): Promise<Tag[]> {
    const sql = 'SELECT * FROM tags ORDER BY name ASC'
    return database.all(sql)
  }

  static async findById(id: number): Promise<Tag | null> {
    const sql = 'SELECT * FROM tags WHERE id = ?'
    return database.get(sql, [id])
  }

  static async findBySlug(slug: string): Promise<Tag | null> {
    const sql = 'SELECT * FROM tags WHERE slug = ?'
    return database.get(sql, [slug])
  }

  static async create(data: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
    const sql = `
      INSERT INTO tags (name, slug)
      VALUES (?, ?)
    `
    const result = await database.run(sql, [
      data.name,
      data.slug
    ])
    
    const tag = await this.findById(result.lastID)
    return tag!
  }

  static async update(id: number, data: Partial<Omit<Tag, 'id' | 'created_at'>>): Promise<Tag | null> {
    const fields = []
    const values = []
    
    if (data.name !== undefined) {
      fields.push('name = ?')
      values.push(data.name)
    }
    if (data.slug !== undefined) {
      fields.push('slug = ?')
      values.push(data.slug)
    }
    
    if (fields.length === 0) {
      return this.findById(id)
    }
    
    values.push(id)
    
    const sql = `UPDATE tags SET ${fields.join(', ')} WHERE id = ?`
    await database.run(sql, values)
    
    return this.findById(id)
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM tags WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }
}
