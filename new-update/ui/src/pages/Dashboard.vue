<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600 mt-1">Welcome back, {{ user?.first_name }}!</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <p class="text-sm text-gray-500">Member since</p>
              <p class="text-sm font-medium">{{ formatDate(user?.created_at) }}</p>
            </div>
            <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-lg">
                {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Organizations Following</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats?.organizationsFollowing || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tags Following</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats?.tagsFollowing || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Account Status</p>
              <p class="text-lg font-semibold text-green-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Section -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
              </div>
              
              <div v-if="user?.bio">
                <label class="block text-sm font-medium text-gray-700">Bio</label>
                <p class="mt-1 text-sm text-gray-900">{{ user.bio }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ user?.role }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <Button @click="showEditProfile = true" variant="outline" size="sm" class="w-full">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <!-- Followed Organizations -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Followed Organizations</h2>
              <Button @click="navigateToOrganizations" variant="outline" size="sm">
                Browse All
              </Button>
            </div>

            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p class="text-gray-500 mt-2">Loading...</p>
            </div>

            <div v-else-if="followedOrganizations.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No organizations followed</h3>
              <p class="mt-1 text-sm text-gray-500">Start following organizations to see them here.</p>
              <div class="mt-6">
                <Button @click="navigateToOrganizations" variant="primary">
                  Browse Organizations
                </Button>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="org in followedOrganizations"
                :key="org.id"
                class="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-medium text-gray-900">{{ org.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ org.summary }}</p>
                    <div class="mt-2">
                      <span class="text-xs text-gray-500">Following since {{ formatDate(org.created_at) }}</span>
                    </div>
                  </div>
                  <Button @click="unfollowOrganization(org.id)" variant="outline" size="sm">
                    Unfollow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Followed Tags Section -->
      <div class="mt-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Followed Tags</h2>
            <Button @click="navigateToPosts" variant="outline" size="sm">
              Browse Posts
            </Button>
          </div>

          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p class="text-gray-500 mt-2">Loading...</p>
          </div>

          <div v-else-if="followedTags.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No tags followed</h3>
            <p class="mt-1 text-sm text-gray-500">Start following tags to see them here.</p>
            <div class="mt-6">
              <Button @click="navigateToPosts" variant="primary">
                Browse Posts
              </Button>
            </div>
          </div>

          <div v-else class="flex flex-wrap gap-2">
            <div
              v-for="tag in followedTags"
              :key="tag.id"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
            >
              {{ tag.name }}
              <button
                @click="unfollowTag(tag.id)"
                class="ml-2 text-primary-600 hover:text-primary-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditProfile" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
          
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                v-model="editForm.first_name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                v-model="editForm.last_name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                v-model="editForm.bio"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3">
              <Button @click="showEditProfile = false" variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" :disabled="updating">
                {{ updating ? 'Updating...' : 'Update' }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ApiService } from '@/services/api'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const user = ref(authStore.user)
const followedOrganizations = ref<any[]>([])
const followedTags = ref<any[]>([])
const stats = ref<any>({})
const loading = ref(true)
const error = ref<string | null>(null)

// Edit profile
const showEditProfile = ref(false)
const updating = ref(false)
const editForm = ref({
  first_name: user.value?.first_name || '',
  last_name: user.value?.last_name || '',
  bio: user.value?.bio || ''
})

const fetchDashboardData = async () => {
  try {
    loading.value = true
    error.value = null

    const data = await ApiService.getDashboardData()
    
    user.value = data.user
    followedOrganizations.value = data.followedOrganizations
    followedTags.value = data.followedTags
    stats.value = data.stats

    // Update auth store
    authStore.setUser(data.user)

  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    updating.value = true
    
    const updatedUser = await ApiService.updateProfile(editForm.value)
    user.value = updatedUser
    authStore.setUser(updatedUser)
    showEditProfile.value = false
    
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = err instanceof Error ? err.message : 'Failed to update profile'
  } finally {
    updating.value = false
  }
}

const unfollowOrganization = async (organizationId: number) => {
  try {
    await ApiService.unfollowOrganization(organizationId)
    followedOrganizations.value = followedOrganizations.value.filter(org => org.id !== organizationId)
    stats.value.organizationsFollowing = Math.max(0, stats.value.organizationsFollowing - 1)
  } catch (err) {
    console.error('Error unfollowing organization:', err)
  }
}

const unfollowTag = async (tagId: number) => {
  try {
    await ApiService.unfollowTag(tagId)
    followedTags.value = followedTags.value.filter(tag => tag.id !== tagId)
    stats.value.tagsFollowing = Math.max(0, stats.value.tagsFollowing - 1)
  } catch (err) {
    console.error('Error unfollowing tag:', err)
  }
}

const navigateToOrganizations = () => {
  router.push('/organizations')
}

const navigateToPosts = () => {
  router.push('/posts')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  fetchDashboardData()
})
</script>
