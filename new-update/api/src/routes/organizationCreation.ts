import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { OrganizationModel } from '../models/Organization'
import { InviteCodeModel } from '../models/InviteCode'
import { AuthMiddleware } from '../middleware/auth'
// import { Organization } from '../types' // Not used in this file

// Simple rate limiting for invite code validation
const validationAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

const router = Router()

// Check if user has permission to generate invite codes
router.get('/invite-permission', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    
    // Check if user has permission to generate invite codes
    let hasPermission = false
    let reason = ''
    
    if (userRole === 'admin' || userRole === 'moderator') {
      hasPermission = true
      reason = `You have ${userRole} privileges`
    } else {
      // Check if user has any existing organizations
      const userOrganizations = await OrganizationModel.findAll()
      const hasOrganization = userOrganizations.some(org => org.created_by === userId)
      
      if (hasOrganization) {
        hasPermission = true
        reason = 'You have existing organizations'
      } else {
        hasPermission = false
        reason = 'You need an existing organization or admin/moderator privileges'
      }
    }
    
    res.json({
      success: true,
      data: { 
        hasPermission,
        reason,
        userRole,
        hasOrganization: hasPermission && userRole === 'user'
      }
    })
  } catch (error) {
    console.error('Error checking invite permission:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to check invite permission'
    })
  }
})

// Generate invite code for sharing with others (not for self-use)
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
router.post('/invite-code', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const userRole = req.user!.role
    
    // Check if user has permission to generate invite codes
    // Only users with existing organizations or admin/moderator roles can generate invite codes
    if (userRole !== 'admin' && userRole !== 'moderator') {
      // Check if user has any existing organizations
      const userOrganizations = await OrganizationModel.findAll()
      const hasOrganization = userOrganizations.some(org => org.created_by === userId)
      
      if (!hasOrganization) {
        return res.status(403).json({
          success: false,
          error: 'You must have an existing organization or be an admin/moderator to generate invite codes'
        })
      }
    }
    
    // Generate invite code for sharing with others
    const code = await InviteCodeModel.generateCode('organization', userId)
    
    return res.json({
      success: true,
      data: { inviteCode: code },
      message: 'Invite code generated successfully. Share this code with someone who wants to create an organization.'
    })
  } catch (error) {
    console.error('Error generating invite code:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate invite code'
    })
  }
})

// Validate invite code (only during organization creation)
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
router.post('/validate-invite', AuthMiddleware.authenticate, [
  body('inviteCode').notEmpty().withMessage('Invite code is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { inviteCode } = req.body
    const userId = req.user!.id
    const userKey = `user_${userId}`
    
    // Rate limiting check
    const now = Date.now()
    const userAttempts = validationAttempts.get(userKey)
    
    if (userAttempts) {
      if (now - userAttempts.lastAttempt < WINDOW_MS) {
        if (userAttempts.count >= MAX_ATTEMPTS) {
          return res.status(429).json({
            success: false,
            error: 'Too many validation attempts. Please try again later.'
          })
        }
        userAttempts.count++
        userAttempts.lastAttempt = now
      } else {
        // Reset window
        validationAttempts.set(userKey, { count: 1, lastAttempt: now })
      }
    } else {
      validationAttempts.set(userKey, { count: 1, lastAttempt: now })
    }
    
    // Check if user is trying to use their own invite code
    const inviteCodeData = await InviteCodeModel.findByCode(inviteCode)
    if (inviteCodeData && inviteCodeData.created_by === userId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot use your own invite code to create an organization'
      })
    }
    
    const isValid = await InviteCodeModel.isValid(inviteCode)
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired invite code'
      })
    }

    return res.json({
      success: true,
      message: 'Invite code is valid'
    })
  } catch (error) {
    console.error('Error validating invite code:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to validate invite code'
    })
  }
})

// Create organization with invite code
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
router.post('/create', AuthMiddleware.authenticate, [
  body('inviteCode').notEmpty().withMessage('Invite code is required'),
  body('title').notEmpty().withMessage('Organization title is required'),
  body('slug').notEmpty().withMessage('Organization slug is required'),
  body('summary').notEmpty().withMessage('Organization summary is required'),
  body('type').optional().isIn(['community', 'action', 'political', 'religious', 'business', 'nonprofit', 'educational', 'social', 'other']),
  body('primary_location').optional().isIn(['remote', 'address', 'space', 'virtual', 'hybrid']),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('social_facebook').optional().isURL().withMessage('Facebook URL must be valid'),
  body('social_twitter').optional().isURL().withMessage('Twitter URL must be valid'),
  body('social_linkedin').optional().isURL().withMessage('LinkedIn URL must be valid'),
  body('social_instagram').optional().isURL().withMessage('Instagram URL must be valid'),
  body('social_youtube').optional().isURL().withMessage('YouTube URL must be valid'),
  body('discord_url').optional().isURL().withMessage('Discord URL must be valid'),
  body('slack_url').optional().isURL().withMessage('Slack URL must be valid')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const userId = req.user!.id
    const { inviteCode, ...organizationData } = req.body

    // Validate invite code
    const isValid = await InviteCodeModel.isValid(inviteCode)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired invite code'
      })
    }

    // Check if user is trying to use their own invite code
    const inviteCodeData = await InviteCodeModel.findByCode(inviteCode)
    if (inviteCodeData && inviteCodeData.created_by === userId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot use your own invite code to create an organization. Get an invite code from someone else.'
      })
    }

    // Check if slug already exists
    const existingOrg = await OrganizationModel.findBySlug(organizationData.slug)
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        error: 'Organization slug already exists'
      })
    }

    // Create organization
    const organization = await OrganizationModel.create({
      ...organizationData,
      created_by: userId,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      status: 'pending' // New organizations require moderation
    })

    // Use the invite code
    await InviteCodeModel.useCode(inviteCode)

    return res.status(201).json({
      success: true,
      data: { organization },
      message: 'Organization created successfully and is pending approval'
    })
  } catch (error) {
    console.error('Error creating organization:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create organization'
    })
  }
})

// Get user's created organizations
router.get('/my-organizations', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    
    const organizations = await OrganizationModel.findAll()
    const userOrgs = organizations.filter(org => org.created_by === userId)

    res.json({
      success: true,
      data: { organizations: userOrgs }
    })
  } catch (error) {
    console.error('Error fetching user organizations:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organizations'
    })
  }
})

// Get invite codes created by user
router.get('/my-invite-codes', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    
    const inviteCodes = await InviteCodeModel.findAll(userId)

    res.json({
      success: true,
      data: { inviteCodes }
    })
  } catch (error) {
    console.error('Error fetching invite codes:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invite codes'
    })
  }
})

export default router
