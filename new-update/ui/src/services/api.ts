import axios, { AxiosResponse } from 'axios'

// API Configuration
const API_BASE_URL = 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

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
  categories?: Category[]
  tags?: Tag[]
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

// API Service Class
export class ApiService {
  // No longer needed - using HTTP-only cookies

  // Authentication methods
  static async login(email: string, password: string): Promise<{ user: User }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.post('/auth/login', {
        email,
        password
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  static async register(userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    bio?: string
  }): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/register', userData)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {}, {
      })
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me', {
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to get user information')
      }
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  static async updateProfile(profileData: {
    first_name?: string
    last_name?: string
    bio?: string
    avatar?: string
  }): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.put('/auth/profile', profileData, {
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      }, {
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  static async forgotPassword(email: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/forgot-password', { email })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to send password reset email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  static async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/reset-password', {
        token,
        password
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // User dashboard and follows
  static async getDashboardData(): Promise<{
    user: User
    followedOrganizations: Organization[]
    followedTags: Tag[]
    stats: {
      organizationsFollowing: number
      tagsFollowing: number
    }
  }> {
    try {
      const response: AxiosResponse<ApiResponse<{
        user: User
        followedOrganizations: Organization[]
        followedTags: Tag[]
        stats: {
          organizationsFollowing: number
          tagsFollowing: number
        }
      }>> = await api.get('/user/dashboard', {
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Get dashboard data error:', error)
      throw error
    }
  }

  static async followOrganization(organizationId: number): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post(`/user/follows/organizations/${organizationId}`, {}, {
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to follow organization')
      }
    } catch (error) {
      console.error('Follow organization error:', error)
      throw error
    }
  }

  static async unfollowOrganization(organizationId: number): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/user/follows/organizations/${organizationId}`, {
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to unfollow organization')
      }
    } catch (error) {
      console.error('Unfollow organization error:', error)
      throw error
    }
  }

  static async followTag(tagId: number): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.post(`/user/follows/tags/${tagId}`, {}, {
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to follow tag')
      }
    } catch (error) {
      console.error('Follow tag error:', error)
      throw error
    }
  }

  static async unfollowTag(tagId: number): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(`/user/follows/tags/${tagId}`, {
      })
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to unfollow tag')
      }
    } catch (error) {
      console.error('Unfollow tag error:', error)
      throw error
    }
  }

  static async isFollowingOrganization(organizationId: number): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse<{ isFollowing: boolean }>> = await api.get(`/user/follows/organizations/${organizationId}/status`, {
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data.isFollowing
      } else {
        return false
      }
    } catch (error) {
      console.error('Check organization follow status error:', error)
      return false
    }
  }

  static async isFollowingTag(tagId: number): Promise<boolean> {
    try {
      const response: AxiosResponse<ApiResponse<{ isFollowing: boolean }>> = await api.get(`/user/follows/tags/${tagId}/status`, {
      })
      
      if (response.data.success && response.data.data) {
        return response.data.data.isFollowing
      } else {
        return false
      }
    } catch (error) {
      console.error('Check tag follow status error:', error)
      return false
    }
  }
  // Organizations
  static async getOrganizations(includePrivate = false): Promise<Organization[]> {
    try {
      const response: AxiosResponse<ApiResponse<Organization[]>> = await api.get(
        `/organizations?includePrivate=${includePrivate}`
      )
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch organizations')
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      throw error
    }
  }

  static async getOrganizationById(id: number): Promise<Organization> {
    try {
      const response: AxiosResponse<ApiResponse<Organization>> = await api.get(`/organizations/${id}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Organization not found')
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      throw error
    }
  }

  static async getOrganizationBySlug(slug: string): Promise<Organization> {
    try {
      const response: AxiosResponse<ApiResponse<Organization>> = await api.get(`/organizations/slug/${slug}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Organization not found')
      }
    } catch (error) {
      console.error('Error fetching organization:', error)
      throw error
    }
  }

  static async searchOrganizations(query: string): Promise<Organization[]> {
    try {
      const response: AxiosResponse<ApiResponse<Organization[]>> = await api.get(`/organizations/search/${encodeURIComponent(query)}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Error searching organizations:', error)
      throw error
    }
  }

  // Posts
  static async getPosts(includePrivate = false): Promise<Post[]> {
    try {
      const response: AxiosResponse<ApiResponse<Post[]>> = await api.get(
        `/posts?includePrivate=${includePrivate}`
      )
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch posts')
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  static async getPostById(id: number): Promise<Post> {
    try {
      const response: AxiosResponse<ApiResponse<Post>> = await api.get(`/posts/${id}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Post not found')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  static async getPostBySlug(slug: string): Promise<Post> {
    try {
      const response: AxiosResponse<ApiResponse<Post>> = await api.get(`/posts/slug/${slug}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Post not found')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  static async getPostsByCategory(categorySlug: string, includePrivate = false): Promise<Post[]> {
    try {
      const response: AxiosResponse<ApiResponse<Post[]>> = await api.get(
        `/posts/category/${categorySlug}?includePrivate=${includePrivate}`
      )
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch posts by category')
      }
    } catch (error) {
      console.error('Error fetching posts by category:', error)
      throw error
    }
  }

  static async getPostsByTag(tagSlug: string, includePrivate = false): Promise<Post[]> {
    try {
      const response: AxiosResponse<ApiResponse<Post[]>> = await api.get(
        `/posts/tag/${tagSlug}?includePrivate=${includePrivate}`
      )
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch posts by tag')
      }
    } catch (error) {
      console.error('Error fetching posts by tag:', error)
      throw error
    }
  }

  static async searchPosts(query: string): Promise<Post[]> {
    try {
      const response: AxiosResponse<ApiResponse<Post[]>> = await api.get(`/posts/search/${encodeURIComponent(query)}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Error searching posts:', error)
      throw error
    }
  }

  // Contributors
  static async getContributors(): Promise<Contributor[]> {
    try {
      const response: AxiosResponse<ApiResponse<Contributor[]>> = await api.get('/contributors')
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch contributors')
      }
    } catch (error) {
      console.error('Error fetching contributors:', error)
      throw error
    }
  }

  static async getContributorById(id: number): Promise<Contributor> {
    try {
      const response: AxiosResponse<ApiResponse<Contributor>> = await api.get(`/contributors/${id}`)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Contributor not found')
      }
    } catch (error) {
      console.error('Error fetching contributor:', error)
      throw error
    }
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      const response: AxiosResponse<ApiResponse<Category[]>> = await api.get('/categories')
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  // Tags
  static async getTags(): Promise<Tag[]> {
    try {
      const response: AxiosResponse<ApiResponse<Tag[]>> = await api.get('/tags')
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Failed to fetch tags')
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
      throw error
    }
  }

  // Health Check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get('http://localhost:3002/health')
      return response.status === 200
    } catch (error) {
      console.error('API health check failed:', error)
      return false
    }
  }

  // Organization creation
  static async checkInvitePermission() {
    try {
      const response: AxiosResponse<ApiResponse<{ hasPermission: boolean; reason: string; userRole: string; hasOrganization: boolean }>> = await api.get('/organization-creation/invite-permission')
      
      if (response.data.success && response.data.data) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to check invite permission')
      }
    } catch (error) {
      console.error('Check invite permission error:', error)
      throw error
    }
  }

  static async generateInviteCode() {
    try {
      const response: AxiosResponse<ApiResponse<{ inviteCode: string }>> = await api.post('/organization-creation/invite-code')
      
      if (response.data.success && response.data.data) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to generate invite code')
      }
    } catch (error) {
      console.error('Generate invite code error:', error)
      throw error
    }
  }

  static async validateInviteCode(inviteCode: string) {
    try {
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await api.post('/organization-creation/validate-invite', { inviteCode })
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to validate invite code')
      }
    } catch (error) {
      console.error('Validate invite code error:', error)
      throw error
    }
  }

  static async createOrganization(organizationData: any) {
    try {
      let orgData:any = {}

      for (const key in organizationData) {
        if (organizationData[key] && organizationData[key] !== '') {
          orgData[key] = organizationData[key]
        }
      }

      const response: AxiosResponse<ApiResponse<Organization>> = await api.post('/organization-creation/create', orgData)
      
      if (response.data.success && response.data.data) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to create organization')
      }
    } catch (error) {
      console.error('Create organization error:', error)
      throw error
    }
  }

  static async getMyOrganizations() {
    try {
      const response: AxiosResponse<ApiResponse<Organization[]>> = await api.get('/organization-creation/my-organizations')
      
      if (response.data.success && response.data.data) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to get organizations')
      }
    } catch (error) {
      console.error('Get my organizations error:', error)
      throw error
    }
  }

  static async getMyInviteCodes() {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await api.get('/organization-creation/my-invite-codes')
      
      if (response.data.success && response.data.data) {
        return response.data
      } else {
        throw new Error(response.data.error || 'Failed to get invite codes')
      }
    } catch (error) {
      console.error('Get my invite codes error:', error)
      throw error
    }
  }
}

// Export default instance
export default ApiService
