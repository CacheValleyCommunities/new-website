import { Router, Request, Response } from 'express'
import { OrganizationModel } from '../models/Organization'
import { ApiResponse } from '../types'

const router = Router()

// GET /api/organizations - Get all organizations
router.get('/', async (req: Request, res: Response) => {
  try {
    const includePrivate = req.query.includePrivate === 'true'
    const organizations = await OrganizationModel.findAll(includePrivate)
    
    const response: ApiResponse<typeof organizations> = {
      success: true,
      data: organizations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching organizations:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch organizations'
    }
    res.status(500).json(response)
  }
})

// GET /api/organizations/:id - Get organization by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const organization = await OrganizationModel.findById(id)
    
    if (!organization) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Organization not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof organization> = {
      success: true,
      data: organization
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch organization'
    }
    res.status(500).json(response)
  }
})

// GET /api/organizations/slug/:slug - Get organization by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const organization = await OrganizationModel.findBySlug(slug)
    
    if (!organization) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Organization not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof organization> = {
      success: true,
      data: organization
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch organization'
    }
    res.status(500).json(response)
  }
})

// POST /api/organizations - Create new organization
router.post('/', async (req: Request, res: Response) => {
  try {
    const organizationData = req.body
    
    // Validate required fields
    if (!organizationData.title || !organizationData.slug || !organizationData.summary || !organizationData.date) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: title, slug, summary, date'
      }
      return res.status(400).json(response)
    }
    
    const organization = await OrganizationModel.create(organizationData)
    
    const response: ApiResponse<typeof organization> = {
      success: true,
      data: organization,
      message: 'Organization created successfully'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error creating organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create organization'
    }
    res.status(500).json(response)
  }
})

// PUT /api/organizations/:id - Update organization
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const organizationData = req.body
    const organization = await OrganizationModel.update(id, organizationData)
    
    if (!organization) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Organization not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof organization> = {
      success: true,
      data: organization,
      message: 'Organization updated successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error updating organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update organization'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/organizations/:id - Delete organization
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid organization ID'
      }
      return res.status(400).json(response)
    }
    
    const deleted = await OrganizationModel.delete(id)
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Organization not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Organization deleted successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error deleting organization:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete organization'
    }
    res.status(500).json(response)
  }
})

// GET /api/organizations/search/:query - Search organizations
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params
    const organizations = await OrganizationModel.search(query)
    
    const response: ApiResponse<typeof organizations> = {
      success: true,
      data: organizations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error searching organizations:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to search organizations'
    }
    res.status(500).json(response)
  }
})

export default router
