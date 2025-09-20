import { Router, Request, Response } from 'express'
import { PostModel } from '../models/Post'
import { CategoryModel } from '../models/Category'
import { TagModel } from '../models/Tag'
import { ApiResponse } from '../types'

const router = Router()

// GET /api/posts - Get all posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const includePrivate = req.query.includePrivate === 'true'
    const posts = await PostModel.findAll(includePrivate)
    
    // Get categories and tags for each post
    const postsWithRelations = await Promise.all(
      posts.map(async (post) => {
        const [categories, tags] = await Promise.all([
          PostModel.getCategories(post.id),
          PostModel.getTags(post.id)
        ])
        
        return {
          ...post,
          categories,
          tags
        }
      })
    )
    
    const response: ApiResponse<typeof postsWithRelations> = {
      success: true,
      data: postsWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching posts:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch posts'
    }
    res.status(500).json(response)
  }
})

// GET /api/posts/:id - Get post by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid post ID'
      }
      return res.status(400).json(response)
    }
    
    const post = await PostModel.findById(id)
    
    if (!post) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      }
      return res.status(404).json(response)
    }
    
    // Get categories and tags
    const [categories, tags] = await Promise.all([
      PostModel.getCategories(post.id),
      PostModel.getTags(post.id)
    ])
    
    const postWithRelations = {
      ...post,
      categories,
      tags
    }
    
    const response: ApiResponse<typeof postWithRelations> = {
      success: true,
      data: postWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching post:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch post'
    }
    res.status(500).json(response)
  }
})

// GET /api/posts/slug/:slug - Get post by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const post = await PostModel.findBySlug(slug)
    
    if (!post) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      }
      return res.status(404).json(response)
    }
    
    // Get categories and tags
    const [categories, tags] = await Promise.all([
      PostModel.getCategories(post.id),
      PostModel.getTags(post.id)
    ])
    
    const postWithRelations = {
      ...post,
      categories,
      tags
    }
    
    const response: ApiResponse<typeof postWithRelations> = {
      success: true,
      data: postWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching post:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch post'
    }
    res.status(500).json(response)
  }
})

// GET /api/posts/category/:categorySlug - Get posts by category
router.get('/category/:categorySlug', async (req: Request, res: Response) => {
  try {
    const { categorySlug } = req.params
    const includePrivate = req.query.includePrivate === 'true'
    const posts = await PostModel.findByCategory(categorySlug, includePrivate)
    
    // Get categories and tags for each post
    const postsWithRelations = await Promise.all(
      posts.map(async (post) => {
        const [categories, tags] = await Promise.all([
          PostModel.getCategories(post.id),
          PostModel.getTags(post.id)
        ])
        
        return {
          ...post,
          categories,
          tags
        }
      })
    )
    
    const response: ApiResponse<typeof postsWithRelations> = {
      success: true,
      data: postsWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch posts by category'
    }
    res.status(500).json(response)
  }
})

// GET /api/posts/tag/:tagSlug - Get posts by tag
router.get('/tag/:tagSlug', async (req: Request, res: Response) => {
  try {
    const { tagSlug } = req.params
    const includePrivate = req.query.includePrivate === 'true'
    const posts = await PostModel.findByTag(tagSlug, includePrivate)
    
    // Get categories and tags for each post
    const postsWithRelations = await Promise.all(
      posts.map(async (post) => {
        const [categories, tags] = await Promise.all([
          PostModel.getCategories(post.id),
          PostModel.getTags(post.id)
        ])
        
        return {
          ...post,
          categories,
          tags
        }
      })
    )
    
    const response: ApiResponse<typeof postsWithRelations> = {
      success: true,
      data: postsWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch posts by tag'
    }
    res.status(500).json(response)
  }
})

// POST /api/posts - Create new post
router.post('/', async (req: Request, res: Response) => {
  try {
    const postData = req.body
    
    // Validate required fields
    if (!postData.title || !postData.slug || !postData.summary || !postData.content || !postData.date) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: title, slug, summary, content, date'
      }
      return res.status(400).json(response)
    }
    
    // Handle categories and tags
    let categoryIds: number[] = []
    let tagIds: number[] = []
    
    if (postData.categories && Array.isArray(postData.categories)) {
      categoryIds = await Promise.all(
        postData.categories.map(async (categoryName: string) => {
          let category = await CategoryModel.findBySlug(categoryName.toLowerCase().replace(/\s+/g, '-'))
          if (!category) {
            category = await CategoryModel.create({
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
              description: `Category for ${categoryName}`
            })
          }
          return category.id
        })
      )
    }
    
    if (postData.tags && Array.isArray(postData.tags)) {
      tagIds = await Promise.all(
        postData.tags.map(async (tagName: string) => {
          let tag = await TagModel.findBySlug(tagName.toLowerCase().replace(/\s+/g, '-'))
          if (!tag) {
            tag = await TagModel.create({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-')
            })
          }
          return tag.id
        })
      )
    }
    
    const post = await PostModel.create(postData, categoryIds, tagIds)
    
    // Get categories and tags for response
    const [categories, tags] = await Promise.all([
      PostModel.getCategories(post.id),
      PostModel.getTags(post.id)
    ])
    
    const postWithRelations = {
      ...post,
      categories,
      tags
    }
    
    const response: ApiResponse<typeof postWithRelations> = {
      success: true,
      data: postWithRelations,
      message: 'Post created successfully'
    }
    
    res.status(201).json(response)
  } catch (error) {
    console.error('Error creating post:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create post'
    }
    res.status(500).json(response)
  }
})

// PUT /api/posts/:id - Update post
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid post ID'
      }
      return res.status(400).json(response)
    }
    
    const postData = req.body
    
    // Handle categories and tags if provided
    let categoryIds: number[] | undefined
    let tagIds: number[] | undefined
    
    if (postData.categories && Array.isArray(postData.categories)) {
      categoryIds = await Promise.all(
        postData.categories.map(async (categoryName: string) => {
          let category = await CategoryModel.findBySlug(categoryName.toLowerCase().replace(/\s+/g, '-'))
          if (!category) {
            category = await CategoryModel.create({
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
              description: `Category for ${categoryName}`
            })
          }
          return category.id
        })
      )
    }
    
    if (postData.tags && Array.isArray(postData.tags)) {
      tagIds = await Promise.all(
        postData.tags.map(async (tagName: string) => {
          let tag = await TagModel.findBySlug(tagName.toLowerCase().replace(/\s+/g, '-'))
          if (!tag) {
            tag = await TagModel.create({
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-')
            })
          }
          return tag.id
        })
      )
    }
    
    const post = await PostModel.update(id, postData, categoryIds, tagIds)
    
    if (!post) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      }
      return res.status(404).json(response)
    }
    
    // Get categories and tags for response
    const [categories, tags] = await Promise.all([
      PostModel.getCategories(post.id),
      PostModel.getTags(post.id)
    ])
    
    const postWithRelations = {
      ...post,
      categories,
      tags
    }
    
    const response: ApiResponse<typeof postWithRelations> = {
      success: true,
      data: postWithRelations,
      message: 'Post updated successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error updating post:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update post'
    }
    res.status(500).json(response)
  }
})

// DELETE /api/posts/:id - Delete post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    
    if (isNaN(id)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid post ID'
      }
      return res.status(400).json(response)
    }
    
    const deleted = await PostModel.delete(id)
    
    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Post not found'
      }
      return res.status(404).json(response)
    }
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Post deleted successfully'
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error deleting post:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete post'
    }
    res.status(500).json(response)
  }
})

// GET /api/posts/search/:query - Search posts
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const { query } = req.params
    const posts = await PostModel.search(query)
    
    // Get categories and tags for each post
    const postsWithRelations = await Promise.all(
      posts.map(async (post) => {
        const [categories, tags] = await Promise.all([
          PostModel.getCategories(post.id),
          PostModel.getTags(post.id)
        ])
        
        return {
          ...post,
          categories,
          tags
        }
      })
    )
    
    const response: ApiResponse<typeof postsWithRelations> = {
      success: true,
      data: postsWithRelations
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error searching posts:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to search posts'
    }
    res.status(500).json(response)
  }
})

export default router
