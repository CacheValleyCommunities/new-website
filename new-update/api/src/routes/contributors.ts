import { Router, Request, Response } from 'express'
import { ContributorModel } from '../models/Contributor'
import { ApiResponse } from '../types'

const router = Router()

// GET /api/contributors - Get all contributors
router.get('/', async (req: Request, res: Response) => {
  try {
    const contributors = await ContributorModel.findAll()
    
    const response: ApiResponse<typeof contributors> = {
      success: true,
      data: contributors
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching contributors:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch contributors'
    }
    res.status(500).json(response)
  }
})

// GET /api/contributors/:id - Get contributor by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid contributor ID'
      }
      return res.status(400).json(response)
    }
    
    const contributor = await ContributorModel.findById(id)
    
    if (!contributor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Contributor not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof contributor> = {
      success: true,
      data: contributor
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching contributor:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch contributor'
    }
    res.status(500).json(response)
  }
})

// POST /api/contributors - Create new contributor
router.post('/', async (req: Request, res: Response) => {
  try {
    const contributorData = req.body
    
    // Validate required fields
    if (!contributorData.name || !contributorData.role || !contributorData.bio) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: name, role, bio'
      }
      return res.status(400).json(response)
    }
    
    const contributor = await ContributorModel.create(contributorData)
    
    const response: ApiResponse<typeof contributor> = {
      success: true,
      data: contributor,
      message: 'Contributor created successfully'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error creating contributor:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create contributor'
    }
    res.status(500).json(response)
  }
})

// PUT /api/contributors/:id - Update contributor
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid contributor ID'
      }
      return res.status(400).json(response)
    }
    
    const contributorData = req.body
    const contributor = await ContributorModel.update(id, contributorData)
    
    if (!contributor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Contributor not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof contributor> = {
      success: true,
      data: contributor,
      message: 'Contributor updated successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error updating contributor:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update contributor'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/contributors/:id - Delete contributor
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid contributor ID'
      }
      return res.status(400).json(response)
    }
    
    const deleted = await ContributorModel.delete(id)
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Contributor not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Contributor deleted successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error deleting contributor:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete contributor'
    }
    res.status(500).json(response)
  }
})

export default router
