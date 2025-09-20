import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Import pages
import Home from './pages/Home.vue'
import Organizations from './pages/Organizations.vue'
import Posts from './pages/Posts.vue'
import Contributors from './pages/Contributors.vue'
import OrganizationDetail from './pages/OrganizationDetail.vue'
import PostDetail from './pages/PostDetail.vue'
import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import CreateOrganization from './pages/CreateOrganization.vue'

// Import layouts
import DefaultLayout from './layouts/DefaultLayout.vue'

// Router configuration
const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/organizations',
        name: 'Organizations',
        component: Organizations
      },
      {
        path: '/organizations/:slug',
        name: 'OrganizationDetail',
        component: OrganizationDetail,
        props: true
      },
      {
        path: '/posts',
        name: 'Posts',
        component: Posts
      },
      {
        path: '/posts/:slug',
        name: 'PostDetail',
        component: PostDetail,
        props: true
      },
      {
        path: '/contributors',
        name: 'Contributors',
        component: Contributors
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: '/create-organization',
        name: 'CreateOrganization',
        component: CreateOrganization,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import('./stores/auth')
  const authStore = useAuthStore()
  
  // Initialize auth if needed
  if (!authStore.isAuthenticated && localStorage.getItem('auth_token')) {
    await authStore.initializeAuth()
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  next()
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
