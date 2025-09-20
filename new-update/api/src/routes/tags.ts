import { Router, Request, Response } from 'express'
import { TagModel } from '../models/Tag'
import { ApiResponse } from '../types'

const router = Router()

// GET /api/tags - Get all tags
router.get('/', async (req: Request, res: Response) => {
  try {
    const tags = await TagModel.findAll()
    
    const response: ApiResponse<typeof tags> = {
      success: true,
      data: tags
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching tags:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch tags'
    }
    res.status(500).json(response)
  }
})

// GET /api/tags/:id - Get tag by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid tag ID'
      }
      return res.status(400).json(response)
    }
    
    const tag = await TagModel.findById(id)
    
    if (!tag) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tag not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof tag> = {
      success: true,
      data: tag
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching tag:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch tag'
    }
    res.status(500).json(response)
  }
})

// GET /api/tags/slug/:slug - Get tag by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const tag = await TagModel.findBySlug(slug)
    
    if (!tag) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Tag not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof tag> = {
      success: true,
      data: tag
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching tag:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch tag'
    }
    res.status(500).json(response)
  }
})

export default router
