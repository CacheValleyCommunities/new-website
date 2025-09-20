import { database } from '../database'
import { Organization } from '../types'

export class OrganizationModel {
  static async findAll(includePrivate = false): Promise<Organization[]> {
    const whereClause = includePrivate ? '' : 'WHERE private = 0'
    const sql = `
      SELECT * FROM organizations 
      ${whereClause}
      ORDER BY date DESC, created_at DESC
    `
    return database.all(sql)
  }

  static async findById(id: number): Promise<Organization | null> {
    const sql = 'SELECT * FROM organizations WHERE id = ?'
    return database.get(sql, [id])
  }

  static async findBySlug(slug: string): Promise<Organization | null> {
    const sql = 'SELECT * FROM organizations WHERE slug = ?'
    return database.get(sql, [slug])
  }

  static async create(data: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
    const sql = `
      INSERT INTO organizations (
        title, slug, summary, description, website, image, date, private,
        type, primary_location, location_address, location_space, about, goals,
        social_facebook, social_twitter, social_linkedin, social_instagram, social_youtube,
        discord_url, slack_url, created_by, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const result = await database.run(sql, [
      data.title,
      data.slug,
      data.summary,
      data.description || null,
      data.website || null,
      data.image || null,
      data.date,
      data.private ? 1 : 0,
      data.type || 'community',
      data.primary_location || 'remote',
      data.location_address || null,
      data.location_space || null,
      data.about || null,
      data.goals || null,
      data.social_facebook || null,
      data.social_twitter || null,
      data.social_linkedin || null,
      data.social_instagram || null,
      data.social_youtube || null,
      data.discord_url || null,
      data.slack_url || null,
      data.created_by || null,
      data.status || 'pending'
    ])
    
    const organization = await this.findById(result.lastID)
    return organization!
  }

  static async update(id: number, data: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>): Promise<Organization | null> {
    const fields = []
    const values = []
    
    if (data.title !== undefined) {
      fields.push('title = ?')
      values.push(data.title)
    }
    if (data.slug !== undefined) {
      fields.push('slug = ?')
      values.push(data.slug)
    }
    if (data.summary !== undefined) {
      fields.push('summary = ?')
      values.push(data.summary)
    }
    if (data.description !== undefined) {
      fields.push('description = ?')
      values.push(data.description)
    }
    if (data.website !== undefined) {
      fields.push('website = ?')
      values.push(data.website)
    }
    if (data.image !== undefined) {
      fields.push('image = ?')
      values.push(data.image)
    }
    if (data.date !== undefined) {
      fields.push('date = ?')
      values.push(data.date)
    }
    if (data.private !== undefined) {
      fields.push('private = ?')
      values.push(data.private ? 1 : 0)
    }
    
    if (fields.length === 0) {
      return this.findById(id)
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)
    
    const sql = `UPDATE organizations SET ${fields.join(', ')} WHERE id = ?`
    await database.run(sql, values)
    
    return this.findById(id)
  }

  static async delete(id: number): Promise<boolean> {
    const sql = 'DELETE FROM organizations WHERE id = ?'
    const result = await database.run(sql, [id])
    return result.changes! > 0
  }

  static async search(query: string): Promise<Organization[]> {
    const sql = `
      SELECT * FROM organizations 
      WHERE private = 0 AND (
        title LIKE ? OR 
        summary LIKE ? OR 
        description LIKE ?
      )
      ORDER BY date DESC
    `
    const searchTerm = `%${query}%`
    return database.all(sql, [searchTerm, searchTerm, searchTerm])
  }
}
