export interface Organization {
  id: number
  title: string
  slug: string
  summary: string
  description?: string
  website?: string
  image?: string
  date: string
  private: boolean
  type?: 'community' | 'action' | 'political' | 'religious' | 'business' | 'nonprofit' | 'educational' | 'social' | 'other'
  primary_location?: 'remote' | 'address' | 'space' | 'virtual' | 'hybrid'
  location_address?: string
  location_space?: string
  about?: string
  goals?: string
  social_facebook?: string
  social_twitter?: string
  social_linkedin?: string
  social_instagram?: string
  social_youtube?: string
  discord_url?: string
  slack_url?: string
  created_by?: number
  status?: 'pending' | 'approved' | 'rejected'
  moderated_by?: number
  moderated_at?: string
  moderation_notes?: string
  created_at: string
  updated_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  summary: string
  content: string
  date: string
  image?: string
  weight?: number
  private: boolean
  created_at: string
  updated_at: string
}

export interface Contributor {
  id: number
  name: string
  role: string
  bio: string
  avatar?: string
  github?: string
  twitter?: string
  linkedin?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface PostCategory {
  post_id: number
  category_id: number
}

export interface PostTag {
  post_id: number
  tag_id: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
