<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation :nav-links="navLinks" />
    
    <main>
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { NavLink } from '@/types'
import Navigation from '@/components/ui/Navigation.vue'
import Footer from '@/components/ui/Footer.vue'

const navLinks: NavLink[] = [
  { name: 'Home', url: '/' },
  { name: 'Organizations', url: '/organizations' },
  { name: 'Posts', url: '/posts' },
  { name: 'Contributors', url: '/contributors' }
]
</script>
