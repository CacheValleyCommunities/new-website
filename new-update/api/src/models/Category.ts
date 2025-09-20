import { database } from '../database'
import { Category } from '../types'

export class CategoryModel {
  static async findAll(): Promise<Category[]> {
    const sql = 'SELECT * FROM categories ORDER BY name ASC'
    return database.all(sql)
  }

  static async findById(id: number): Promise<Category | null> {
    const sql = 'SELECT * FROM categories WHERE id = ?'
    return database.get(sql, [id])
  }

  static async findBySlug(slug: string): Promise<Category | null> {
    const sql = 'SELECT * FROM categories WHERE slug = ?'
    return database.get(sql, [slug])
  }

  static async create(data: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const sql = `
      INSERT INTO categories (name, slug, description)
      VALUES (?, ?, ?)
    `
    const result = await database.run(sql, [
      data.name,
      data.slug,
      data.description || null
    ])
    
    const category = await this.findById(result.lastID)
    return category!
  }

  static async update(id: number, data: Partial<Omit<Category, 'id' | 'created_at'>>): Promise<Category | null> {
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
    if (data.description !== undefined) {
      fields.push('description = ?')
      values.push(data.description)
    }
    
    if (fields.length === 0) {
      return this.findById(id)
    }
    
    values.push(id)
    
    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`
    await database.run(sql, values)
    
    return this.findById(id)
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM categories WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }
}
