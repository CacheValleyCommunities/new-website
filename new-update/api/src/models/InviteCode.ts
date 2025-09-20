import { database } from '../database/index'

export interface InviteCode {
  id: number
  code: string
  type: 'organization' | 'post'
  max_uses: number
  used_count: number
  created_by?: number
  expires_at?: string
  is_active: boolean
  created_at: string
}

export class InviteCodeModel {
  static async create(inviteCode: Omit<InviteCode, 'id' | 'created_at'>): Promise<number> {
    const sql = `
      INSERT INTO invite_codes (
        code, type, max_uses, used_count, created_by, expires_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    const result = await database.run(sql, [
      inviteCode.code,
      inviteCode.type,
      inviteCode.max_uses,
      inviteCode.used_count,
      inviteCode.created_by || null,
      inviteCode.expires_at || null,
      inviteCode.is_active
    ])
    
    return result.lastID!
  }

  static async findByCode(code: string): Promise<InviteCode | null> {
    const sql = 'SELECT * FROM invite_codes WHERE code = ? AND is_active = 1'
    const result = await database.get(sql, [code])
    return result as InviteCode | null
  }

  static async isValid(code: string): Promise<boolean> {
    const inviteCode = await this.findByCode(code)
    
    if (!inviteCode) {
      return false
    }

    // Check if expired
    if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
      return false
    }

    // Check if max uses reached
    if (inviteCode.used_count >= inviteCode.max_uses) {
      return false
    }

    return true
  }

  static async useCode(code: string): Promise<boolean> {
    const sql = `
      UPDATE invite_codes 
      SET used_count = used_count + 1 
      WHERE code = ? AND is_active = 1 AND used_count < max_uses
    `
    
    const result = await database.run(sql, [code])
    return result.changes > 0
  }

  static async generateCode(type: 'organization' | 'post' = 'organization', createdBy?: number): Promise<string> {
    // Generate a random 8-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // Check if code already exists
    const existing = await this.findByCode(code)
    if (existing) {
      // Recursively generate a new code if collision
      return this.generateCode(type, createdBy)
    }

    // Create the invite code
    await this.create({
      code,
      type,
      max_uses: 1,
      used_count: 0,
      created_by: createdBy || undefined,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      is_active: true
    })

    return code
  }

  static async findAll(createdBy?: number): Promise<InviteCode[]> {
    let sql = 'SELECT * FROM invite_codes WHERE is_active = 1'
    const params: any[] = []

    if (createdBy) {
      sql += ' AND created_by = ?'
      params.push(createdBy)
    }

    sql += ' ORDER BY created_at DESC'

    const result = await database.all(sql, params)
    return result as InviteCode[]
  }

  static async deactivate(code: string): Promise<boolean> {
    const sql = 'UPDATE invite_codes SET is_active = 0 WHERE code = ?'
    const result = await database.run(sql, [code])
    return result.changes > 0
  }
}
