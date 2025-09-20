import { database } from '../database'
import { Post, Category, Tag } from '../types'

export class PostModel {
  static async findAll(includePrivate = false): Promise<Post[]> {
    const whereClause = includePrivate ? '' : 'WHERE private = 0'
    const sql = `
      SELECT * FROM posts 
      ${whereClause}
      ORDER BY weight DESC, date DESC, created_at DESC
    `
    return database.all(sql)
  }

  static async findById(id: number): Promise<Post | null> {
    const sql = 'SELECT * FROM posts WHERE id = ?'
    return database.get(sql, [id])
  }

  static async findBySlug(slug: string): Promise<Post | null> {
    const sql = 'SELECT * FROM posts WHERE slug = ?'
    return database.get(sql, [slug])
  }

  static async findByCategory(categorySlug: string, includePrivate = false): Promise<Post[]> {
    const whereClause = includePrivate ? '' : 'AND p.private = 0'
    const sql = `
      SELECT p.* FROM posts p
      INNER JOIN post_categories pc ON p.id = pc.post_id
      INNER JOIN categories c ON pc.category_id = c.id
      WHERE c.slug = ? ${whereClause}
      ORDER BY p.weight DESC, p.date DESC
    `
    return database.all(sql, [categorySlug])
  }

  static async findByTag(tagSlug: string, includePrivate = false): Promise<Post[]> {
    const whereClause = includePrivate ? '' : 'AND p.private = 0'
    const sql = `
      SELECT p.* FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      WHERE t.slug = ? ${whereClause}
      ORDER BY p.weight DESC, p.date DESC
    `
    return database.all(sql, [tagSlug])
  }

  static async getCategories(postId: number): Promise<Category[]> {
    const sql = `
      SELECT c.* FROM categories c
      INNER JOIN post_categories pc ON c.id = pc.category_id
      WHERE pc.post_id = ?
    `
    return database.all(sql, [postId])
  }

  static async getTags(postId: number): Promise<Tag[]> {
    const sql = `
      SELECT t.* FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `
    return database.all(sql, [postId])
  }

  static async create(data: Omit<Post, 'id' | 'created_at' | 'updated_at'>, categoryIds: number[] = [], tagIds: number[] = []): Promise<Post> {
    return database.transaction(async () => {
      // Insert post
      const sql = `
        INSERT INTO posts (title, slug, summary, content, date, image, weight, private)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      const result = await database.run(sql, [
        data.title,
        data.slug,
        data.summary,
        data.content,
        data.date,
        data.image || null,
        data.weight || 0,
        data.private ? 1 : 0
      ])
      
      const postId = result.lastID!
      
      // Insert categories
      if (categoryIds.length > 0) {
        const categorySql = 'INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)'
        for (const categoryId of categoryIds) {
          await database.run(categorySql, [postId, categoryId])
        }
      }
      
      // Insert tags
      if (tagIds.length > 0) {
        const tagSql = 'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)'
        for (const tagId of tagIds) {
          await database.run(tagSql, [postId, tagId])
        }
      }
      
      const post = await this.findById(postId)
      return post!
    })
  }

  static async update(id: number, data: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>, categoryIds?: number[], tagIds?: number[]): Promise<Post | null> {
    return database.transaction(async () => {
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
      if (data.content !== undefined) {
        fields.push('content = ?')
        values.push(data.content)
      }
      if (data.date !== undefined) {
        fields.push('date = ?')
        values.push(data.date)
      }
      if (data.image !== undefined) {
        fields.push('image = ?')
        values.push(data.image)
      }
      if (data.weight !== undefined) {
        fields.push('weight = ?')
        values.push(data.weight)
      }
      if (data.private !== undefined) {
        fields.push('private = ?')
        values.push(data.private ? 1 : 0)
      }
      
      if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP')
        values.push(id)
        
        const sql = `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`
        await database.run(sql, values)
      }
      
      // Update categories if provided
      if (categoryIds !== undefined) {
        await database.run('DELETE FROM post_categories WHERE post_id = ?', [id])
        if (categoryIds.length > 0) {
          const categorySql = 'INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)'
          for (const categoryId of categoryIds) {
            await database.run(categorySql, [id, categoryId])
          }
        }
      }
      
      // Update tags if provided
      if (tagIds !== undefined) {
        await database.run('DELETE FROM post_tags WHERE post_id = ?', [id])
        if (tagIds.length > 0) {
          const tagSql = 'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)'
          for (const tagId of tagIds) {
            await database.run(tagSql, [id, tagId])
          }
        }
      }
      
      return this.findById(id)
    })
  }

  static async delete(id: number): Promise<boolean> {
    return database.transaction(async () => {
      // Delete related records first
      await database.run('DELETE FROM post_categories WHERE post_id = ?', [id])
      await database.run('DELETE FROM post_tags WHERE post_id = ?', [id])
      
      // Delete post
      const sql = 'DELETE FROM posts WHERE id = ?'
      const result = await database.run(sql, [id])
      return result.changes! > 0
    })
  }

  static async search(query: string): Promise<Post[]> {
    const sql = `
      SELECT * FROM posts 
      WHERE private = 0 AND (
        title LIKE ? OR 
        summary LIKE ? OR 
        content LIKE ?
      )
      ORDER BY weight DESC, date DESC
    `
    const searchTerm = `%${query}%`
    return database.all(sql, [searchTerm, searchTerm, searchTerm])
  }
}
