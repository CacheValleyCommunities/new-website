import { Router, Request, Response } from 'express'
import { UserModel } from '../models/User'
import { AuthMiddleware } from '../middleware/auth'
import { ApiResponse } from '../types'

const router = Router()

// All routes require authentication
router.use(AuthMiddleware.authenticate)

// GET /api/user/follows/organizations - Get user's followed organizations
router.get('/follows/organizations', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const organizations = await UserModel.getFollowedOrganizations(userId)
    
    const response: ApiResponse<typeof organizations> = {
      success: true,
      data: organizations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching followed organizations:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch followed organizations'
    }
    res.status(500).json(response)
  }
})

// GET /api/user/follows/tags - Get user's followed tags
router.get('/follows/tags', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const tags = await UserModel.getFollowedTags(userId)
    
    const response: ApiResponse<typeof tags> = {
      success: true,
      data: tags
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching followed tags:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch followed tags'
    }
    res.status(500).json(response)
  }
})

// POST /api/user/follows/organizations/:id - Follow an organization
router.post('/follows/organizations/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const organizationId = parseInt(req.params.id)
    
    if (isNaN(organizationId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const success = await UserModel.followOrganization(userId, organizationId)
    
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Already following this organization'
      }
      return res.status(409).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Successfully followed organization'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error following organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to follow organization'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/user/follows/organizations/:id - Unfollow an organization
router.delete('/follows/organizations/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const organizationId = parseInt(req.params.id)
    
    if (isNaN(organizationId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const success = await UserModel.unfollowOrganization(userId, organizationId)
    
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Not following this organization'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Successfully unfollowed organization'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error unfollowing organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to unfollow organization'
    }
    res.status(500).json(response)
  }
})

// POST /api/user/follows/tags/:id - Follow a tag
router.post('/follows/tags/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const tagId = parseInt(req.params.id)
    
    if (isNaN(tagId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid tag ID'
      }
      return res.status(400).json(response)
    }
    
    const success = await UserModel.followTag(userId, tagId)
    
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Already following this tag'
      }
      return res.status(409).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Successfully followed tag'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error following tag:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to follow tag'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/user/follows/tags/:id - Unfollow a tag
router.delete('/follows/tags/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const tagId = parseInt(req.params.id)
    
    if (isNaN(tagId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid tag ID'
      }
      return res.status(400).json(response)
    }
    
    const success = await UserModel.unfollowTag(userId, tagId)
    
    if (!success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Not following this tag'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Successfully unfollowed tag'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error unfollowing tag:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to unfollow tag'
    }
    res.status(500).json(response)
  }
})

// GET /api/user/follows/organizations/:id/status - Check if following organization
router.get('/follows/organizations/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const organizationId = parseInt(req.params.id)
    
    if (isNaN(organizationId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const isFollowing = await UserModel.isFollowingOrganization(userId, organizationId)
    
    const response: ApiResponse<{ isFollowing: boolean }> = {
      success: true,
      data: { isFollowing }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error checking organization follow status:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to check follow status'
    }
    res.status(500).json(response)
  }
})

// GET /api/user/follows/tags/:id/status - Check if following tag
router.get('/follows/tags/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const tagId = parseInt(req.params.id)
    
    if (isNaN(tagId)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid tag ID'
      }
      return res.status(400).json(response)
    }
    
    const isFollowing = await UserModel.isFollowingTag(userId, tagId)
    
    const response: ApiResponse<{ isFollowing: boolean }> = {
      success: true,
      data: { isFollowing }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error checking tag follow status:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to check follow status'
    }
    res.status(500).json(response)
  }
})

// GET /api/user/dashboard - Get user dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    
    // Get user's followed organizations and tags
    const [followedOrganizations, followedTags] = await Promise.all([
      UserModel.getFollowedOrganizations(userId),
      UserModel.getFollowedTags(userId)
    ])
    
    const dashboardData = {
      user: req.user,
      followedOrganizations,
      followedTags,
      stats: {
        organizationsFollowing: followedOrganizations.length,
        tagsFollowing: followedTags.length
      }
    }
    
    // Remove sensitive data
    const { password_hash, email_verification_token, password_reset_token, password_reset_expires, ...userData } = dashboardData.user
    
    const response: ApiResponse<typeof dashboardData> = {
      success: true,
      data: {
        ...dashboardData,
        user: userData
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch dashboard data'
    }
    res.status(500).json(response)
  }
})

export default router
