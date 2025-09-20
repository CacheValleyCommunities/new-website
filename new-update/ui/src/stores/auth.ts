import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ApiService } from '@/services/api'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar?: string
  bio?: string
  role: 'user' | 'admin' | 'moderator'
  email_verified: boolean
  last_login?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => ['admin', 'moderator'].includes(user.value?.role || ''))

  // Actions
  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const clearAuth = () => {
    user.value = null
  }

  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      
      const response = await ApiService.login(email, password)
      
      setUser(response.user)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed'
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    bio?: string
  }) => {
    try {
      loading.value = true
      
      const response = await ApiService.register(userData)
      
      setToken(response.token)
      setUser(response.user)
      
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await ApiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  const fetchUser = async () => {
    try {
      const userData = await ApiService.getCurrentUser()
      setUser(userData)
      return true
    } catch (error) {
      console.error('Fetch user error:', error)
      clearAuth()
      return false
    }
  }

  const updateProfile = async (profileData: {
    first_name?: string
    last_name?: string
    bio?: string
    avatar?: string
  }) => {
    try {
      const updatedUser = await ApiService.updateProfile(profileData)
      setUser(updatedUser)
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Update failed' 
      }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await ApiService.changePassword(currentPassword, newPassword)
      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password change failed' 
      }
    }
  }

  // Initialize auth state by fetching user from /me endpoint
  const initializeAuth = async () => {
    const success = await fetchUser()
    if (!success) {
      clearAuth()
    }
  }

  return {
    // State
    user,
    loading,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isModerator,
    
    // Actions
    setUser,
    clearAuth,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    initializeAuth
  }
})
