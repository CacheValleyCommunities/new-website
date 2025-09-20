import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserModel, User } from '../models/User'

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d'

export interface JWTPayload {
  userId: number
  email: string
  role: string
  iat?: number
  exp?: number
}

export class AuthMiddleware {
  // Generate JWT token
  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as string })
  }

  // Verify JWT token
  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  }

  // Authentication middleware
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Try to get token from HTTP-only cookie first
      let token = req.cookies?.['jwt']
      
      // Fallback to Authorization header for backward compatibility
      if (!token) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7) // Remove 'Bearer ' prefix
        }
      }
      
      if (!token) {
        res.status(401).json({
          success: false,
          error: 'Access token required'
        })
        return
      }
      const payload = AuthMiddleware.verifyToken(token)

      if (!payload) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        })
        return
      }

      // Get user from database
      const user = await UserModel.findById(payload['userId'])
      
      if (!user || !user.is_active) {
        res.status(401).json({
          success: false,
          error: 'User not found or inactive'
        })
        return
      }

      req.user = user
      next()
    } catch (error) {
      console.error('Authentication error:', error)
      res.status(500).json({
        success: false,
        error: 'Authentication failed'
      })
    }
  }

  // Optional authentication middleware (doesn't fail if no token)
  static async optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const payload = AuthMiddleware.verifyToken(token)

        if (payload) {
          const user = await UserModel.findById(payload['userId'])
          if (user && user.is_active) {
            req.user = user
          }
        }
      }

      next()
    } catch (error) {
      console.error('Optional authentication error:', error)
      next() // Continue even if there's an error
    }
  }

  // Authorization middleware for admin only
  static requireAdmin(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
      return
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
      return
    }

    next()
  }

  // Authorization middleware for admin or moderator
  static requireModerator(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
      return
    }

    if (!['admin', 'moderator'].includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Moderator access required'
      })
      return
    }

    next()
  }

  // Check if user owns resource or is admin/moderator
  static requireOwnershipOrModerator(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
      return
    }

    const resourceUserId = parseInt(req.params.userId || req.body.userId || '0')
    
    if (req.user.id !== resourceUserId && !['admin', 'moderator'].includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Access denied'
      })
      return
    }

    next()
  }

  // Rate limiting for authentication endpoints
  static createRateLimit() {
    const rateLimit = require('express-rate-limit')
    
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // Limit each IP to 5 requests per windowMs
      message: {
        success: false,
        error: 'Too many authentication attempts, please try again later'
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
  }

  // Password strength validation
  static validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Email validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
