import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { UserModel, CreateUserData } from '../models/User'
import { AuthMiddleware } from '../middleware/auth'
import { ApiResponse } from '../types'

const router = Router()

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('first_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
]

// POST /api/auth/register - Register new user
router.post('/register', registerValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const { email, password, first_name, last_name, bio } = req.body

    // Validate email format
    if (!AuthMiddleware.validateEmail(email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email format'
      }
      return res.status(400).json(response)
    }

    // Validate password strength
    const passwordValidation = AuthMiddleware.validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Password does not meet requirements',
        message: passwordValidation.errors.join(', ')
      }
      return res.status(400).json(response)
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User with this email already exists'
      }
      return res.status(409).json(response)
    }

    // Create user
    const userData: CreateUserData = {
      email,
      password,
      first_name,
      last_name,
      bio
    }

    const user = await UserModel.create(userData)

    // Generate JWT token
    const token = AuthMiddleware.generateToken(user)

    // Remove sensitive data from response
    const { password_hash, email_verification_token, password_reset_token, password_reset_expires, ...userResponse } = user

    const response: ApiResponse<{ user: typeof userResponse; token: string }> = {
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'User registered successfully'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Registration failed'
    }
    res.status(500).json(response)
  }
})

// POST /api/auth/login - Login user
router.post('/login', loginValidation, AuthMiddleware.createRateLimit(), async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const { email, password } = req.body

    // Find user by email
    const user = await UserModel.findByEmail(email)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email or password'
      }
      return res.status(401).json(response)
    }

    // Check if user is active
    if (!user.is_active) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Account is deactivated'
      }
      return res.status(401).json(response)
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(password, user.password_hash)
    if (!isValidPassword) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email or password'
      }
      return res.status(401).json(response)
    }

    // Update last login
    await UserModel.updateLastLogin(user.id)

    // Generate JWT token
    const token = AuthMiddleware.generateToken(user)

    // Set HTTP-only cookie with JWT token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production', // Only use secure cookies in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Remove sensitive data from response
    const { password_hash, email_verification_token, password_reset_token, password_reset_expires, ...userResponse } = user

    const response: ApiResponse<{ user: typeof userResponse }> = {
      success: true,
      data: {
        user: userResponse
      },
      message: 'Login successful'
    }

    res.json(response)
  } catch (error) {
    console.error('Login error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Login failed'
    }
    res.status(500).json(response)
  }
})

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', (_req: Request, res: Response) => {
  // Clear the HTTP-only cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'strict'
  })
  
  const response: ApiResponse<null> = {
    success: true,
    message: 'Logout successful'
  }
  res.json(response)
})

// GET /api/auth/me - Get current user
router.get('/me', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  try {
    const user = req.user!
    
    // Remove sensitive data from response
    const { password_hash, email_verification_token, password_reset_token, password_reset_expires, ...userResponse } = user

    const response: ApiResponse<typeof userResponse> = {
      success: true,
      data: userResponse
    }

    res.json(response)
  } catch (error) {
    console.error('Get user error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to get user information'
    }
    res.status(500).json(response)
  }
})

// PUT /api/auth/profile - Update user profile
router.put('/profile', AuthMiddleware.authenticate, [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters')
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const userId = req.user!.id
    const { first_name, last_name, bio, avatar } = req.body

    const updatedUser = await UserModel.update(userId, {
      first_name,
      last_name,
      bio,
      avatar
    })

    if (!updatedUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      }
      return res.status(404).json(response)
    }

    // Remove sensitive data from response
    const { password_hash, email_verification_token, password_reset_token, password_reset_expires, ...userResponse } = updatedUser

    const response: ApiResponse<typeof userResponse> = {
      success: true,
      data: userResponse,
      message: 'Profile updated successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Update profile error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update profile'
    }
    res.status(500).json(response)
  }
})

// PUT /api/auth/change-password - Change password
router.put('/change-password', AuthMiddleware.authenticate, changePasswordValidation, async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const userId = req.user!.id
    const { currentPassword, newPassword } = req.body

    // Get current user
    const user = await UserModel.findById(userId)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      }
      return res.status(404).json(response)
    }

    // Validate current password
    const isValidPassword = await UserModel.validatePassword(currentPassword, user.password_hash)
    if (!isValidPassword) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Current password is incorrect'
      }
      return res.status(401).json(response)
    }

    // Validate new password strength
    const passwordValidation = AuthMiddleware.validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'New password does not meet requirements',
        message: passwordValidation.errors.join(', ')
      }
      return res.status(400).json(response)
    }

    // Update password
    const success = await UserModel.updatePassword(userId, newPassword)
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to update password'
      }
      return res.status(500).json(response)
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password updated successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Change password error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to change password'
    }
    res.status(500).json(response)
  }
})

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const { email } = req.body

    // Generate reset token (always return success for security)
    const token = await UserModel.setPasswordResetToken(email)

    // In a real application, you would send an email here
    console.log(`Password reset token for ${email}: ${token}`)

    const response: ApiResponse<null> = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    }

    res.json(response)
  } catch (error) {
    console.error('Forgot password error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to process password reset request'
    }
    res.status(500).json(response)
  }
})

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: errors.array().map(err => err.msg).join(', ')
      }
      return res.status(400).json(response)
    }

    const { token, password } = req.body

    // Find user by reset token
    const user = await UserModel.findByPasswordResetToken(token)
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid or expired reset token'
      }
      return res.status(400).json(response)
    }

    // Validate password strength
    const passwordValidation = AuthMiddleware.validatePasswordStrength(password)
    if (!passwordValidation.isValid) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Password does not meet requirements',
        message: passwordValidation.errors.join(', ')
      }
      return res.status(400).json(response)
    }

    // Update password
    const success = await UserModel.updatePassword(user.id, password)
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Failed to reset password'
      }
      return res.status(500).json(response)
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password reset successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Reset password error:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to reset password'
    }
    res.status(500).json(response)
  }
})

export default router
