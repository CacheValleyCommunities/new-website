<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="container">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">CVC</span>
            </div>
            <span class="text-xl font-bold text-gray-900">Cache Valley Communities</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.url"
            class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600': $route.path === link.url }"
          >
            {{ link.name }}
          </router-link>
          
          <!-- Auth buttons -->
          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-primary-600': $route.path === '/dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link
              to="/create-organization"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="{ 'text-primary-600': $route.path === '/create-organization' }"
            >
              Create Organization
            </router-link>
            <div class="relative group">
              <button class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2">
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">
                    {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
                  </span>
                </div>
                <span class="text-sm">{{ user?.first_name }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
            >
              Sign Up
            </router-link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center space-x-2">
          <template v-if="isAuthenticated">
            <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
              </span>
            </div>
          </template>
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-gray-900 p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200">
        <div class="py-4 space-y-2">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.url"
            class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.path === link.url }"
            @click="closeMobileMenu"
          >
            {{ link.name }}
          </router-link>
          
          <!-- Mobile auth links -->
          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-primary-600 bg-primary-50': $route.path === '/dashboard' }"
              @click="closeMobileMenu"
            >
              Dashboard
            </router-link>
            <router-link
              to="/create-organization"
              class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-primary-600 bg-primary-50': $route.path === '/create-organization' }"
              @click="closeMobileMenu"
            >
              Create Organization
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Sign Out
            </button>
          </template>
          
          <template v-else>
            <router-link
              to="/login"
              class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200"
              @click="closeMobileMenu"
            >
              Sign In
            </router-link>
            <router-link
              to="/register"
              class="block px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-md text-sm font-medium transition-colors duration-200"
              @click="closeMobileMenu"
            >
              Sign Up
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { NavLink } from '@/types'

interface Props {
  navLinks?: NavLink[]
}

const props = withDefaults(defineProps<Props>(), {
  navLinks: () => [
    { name: 'Home', url: '/' },
    { name: 'Organizations', url: '/organizations' },
    { name: 'Posts', url: '/posts' },
    { name: 'Contributors', url: '/contributors' }
  ]
})

const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
  closeMobileMenu()
}
</script>
