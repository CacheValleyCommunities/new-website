<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Cache Valley Communities</h1>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </router-link>
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">
                First name
              </label>
              <div class="mt-1">
                <input
                  id="first_name"
                  v-model="form.first_name"
                  name="first_name"
                  type="text"
                  autocomplete="given-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.first_name }"
                />
                <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name }}</p>
              </div>
            </div>

            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <div class="mt-1">
                <input
                  id="last_name"
                  v-model="form.last_name"
                  name="last_name"
                  type="text"
                  autocomplete="family-name"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.last_name }"
                />
                <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name }}</p>
              </div>
            </div>
          </div>

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
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
              <div class="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </div>
            </div>
          </div>

          <div>
            <label for="confirm_password" class="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div class="mt-1">
              <input
                id="confirm_password"
                v-model="form.confirm_password"
                name="confirm_password"
                type="password"
                autocomplete="new-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.confirm_password }"
              />
              <p v-if="errors.confirm_password" class="mt-1 text-sm text-red-600">{{ errors.confirm_password }}</p>
            </div>
          </div>

          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <div class="mt-1">
              <textarea
                id="bio"
                v-model="form.bio"
                name="bio"
                rows="3"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.bio }"
              ></textarea>
              <p v-if="errors.bio" class="mt-1 text-sm text-red-600">{{ errors.bio }}</p>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              name="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the
              <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
              and
              <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </label>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :disabled="loading"
            >
              {{ loading ? 'Creating account...' : 'Create account' }}
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
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  bio: '',
  acceptTerms: false
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  bio: ''
})

const loading = ref(false)
const error = ref('')

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  if (!form.first_name.trim()) {
    errors.first_name = 'First name is required'
    isValid = false
  }
  
  if (!form.last_name.trim()) {
    errors.last_name = 'Last name is required'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(form.password)) {
    errors.password = 'Password must contain uppercase, lowercase, number, and special character'
    isValid = false
  }
  
  if (!form.confirm_password) {
    errors.confirm_password = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirm_password) {
    errors.confirm_password = 'Passwords do not match'
    isValid = false
  }
  
  if (form.bio && form.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters'
    isValid = false
  }
  
  if (!form.acceptTerms) {
    error.value = 'You must accept the terms and conditions'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    error.value = ''
    
    const result = await authStore.register({
      email: form.email,
      password: form.password,
      first_name: form.first_name,
      last_name: form.last_name,
      bio: form.bio || undefined
    })
    
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
