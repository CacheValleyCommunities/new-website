import { Router, Request, Response } from 'express'
import { CategoryModel } from '../models/Category'
import { ApiResponse } from '../types'

const router = Router()

// GET /api/categories - Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.findAll()
    
    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching categories:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories'
    }
    res.status(500).json(response)
  }
})

// GET /api/categories/:id - Get category by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid category ID'
      }
      return res.status(400).json(response)
    }
    
    const category = await CategoryModel.findById(id)
    
    if (!category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof category> = {
      success: true,
      data: category
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching category:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch category'
    }
    res.status(500).json(response)
  }
})

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const category = await CategoryModel.findBySlug(slug)
    
    if (!category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<typeof category> = {
      success: true,
      data: category
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching category:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch category'
    }
    res.status(500).json(response)
  }
})

export default router
