<template>
  <div>
    <!-- Page Header -->
    <Section background="primary" padding="lg">
      <div class="text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6">Posts</h1>
        <p class="text-xl text-primary-100 max-w-3xl mx-auto">
          Stay updated with the latest news, events, and insights from our community. 
          From tech meetups to educational resources, discover what's happening in Cache Valley.
        </p>
      </div>
    </Section>

    <!-- Filter and Search -->
    <Section background="white" padding="sm">
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="category in availableCategories"
            :key="category"
            :variant="selectedCategory === category ? 'primary' : 'outline'"
            size="sm"
            @click="setCategory(category)"
          >
            {{ category }}
          </Button>
        </div>
        
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </Section>

    <!-- Posts Grid -->
    <Section background="gray">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading posts...</p>
      </div>

      <div v-else-if="filteredPosts.length === 0" class="text-center py-12">
        <p class="text-gray-600">No posts found matching your criteria.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard
          v-for="post in filteredPosts"
          :key="post.id"
          :title="post.title"
          :description="post.summary"
          :image="post.image"
          :category="post.categories[0]"
          :tags="post.tags"
          :date="post.date"
          :link="`/posts/${post.slug}`"
        />
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Post, Category } from '@/types'
import { ApiService } from '@/services/api'
import Section from '@/components/ui/Section.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import Button from '@/components/ui/Button.vue'

const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategory = ref('All')

const availableCategories = computed(() => {
  const allCategories = ['All', ...categories.value.map(cat => cat.name)]
  return allCategories
})

const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by category
  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(post => 
      post.categories?.some(cat => cat.name === selectedCategory.value)
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.summary.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.name.toLowerCase().includes(query))
    )
  }

  return filtered
})

const setCategory = (category: string) => {
  selectedCategory.value = category
}

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch posts and categories in parallel
    const [postsData, categoriesData] = await Promise.all([
      ApiService.getPosts(),
      ApiService.getCategories()
    ])

    posts.value = postsData
    categories.value = categoriesData
  } catch (err) {
    console.error('Failed to load posts:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
