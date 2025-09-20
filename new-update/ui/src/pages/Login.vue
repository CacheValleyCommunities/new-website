<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Cache Valley Communities</h1>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </router-link>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" @click.prevent="showForgotPassword = true" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :disabled="loading"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </Button>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ error }}
                </h3>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Reset Password</h3>
          
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                v-model="forgotPasswordForm.email"
                type="email"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div class="flex justify-end space-x-3">
              <Button @click="showForgotPassword = false" variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" :disabled="forgotPasswordLoading">
                {{ forgotPasswordLoading ? 'Sending...' : 'Send Reset Link' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

// Forgot password
const showForgotPassword = ref(false)
const forgotPasswordForm = reactive({
  email: ''
})
const forgotPasswordLoading = ref(false)

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = ''
    
    const result = await authStore.login(form.email, form.password)
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  try {
    forgotPasswordLoading.value = true
    
    // Import ApiService dynamically to avoid circular imports
    const { ApiService } = await import('@/services/api')
    await ApiService.forgotPassword(forgotPasswordForm.email)
    
    showForgotPassword.value = false
    forgotPasswordForm.email = ''
    
    // Show success message
    alert('If an account with that email exists, a password reset link has been sent.')
  } catch (err) {
    console.error('Forgot password error:', err)
    alert('Failed to send password reset email. Please try again.')
  } finally {
    forgotPasswordLoading.value = false
  }
}
</script>
