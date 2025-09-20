<template>
  <div>
    <!-- Hero Section -->
    <Hero
      title="Cache Valley Communities"
      subtitle="Building Connections"
      description="Cache Valley Communities aims to partner with organizations in the Cache Valley, Utah area to provide up-to-date information in a readily accessible manner."
      image="https://images.unsplash.com/photo-1569981889244-a358a2d4427b?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      image-alt="Community gathering"
      :actions="heroActions"
    />

    <!-- Featured Organizations -->
    <Section
      title="Featured Organizations"
      subtitle="Discover the amazing organizations making a difference in Cache Valley"
      background="white"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard
          v-for="org in featuredOrganizations"
          :key="org.id"
          :title="org.title"
          :description="org.summary"
          :image="org.image"
          :category="'Organization'"
          :date="org.date"
          :link="`/organizations/${org.slug}`"
        />
      </div>
      
      <div class="text-center mt-8">
        <Button variant="primary" size="lg" @click="navigateToOrganizations">
          View All Organizations
        </Button>
      </div>
    </Section>

    <!-- Latest Posts -->
    <Section
      title="Latest Posts"
      subtitle="Stay updated with the latest news and insights from our community"
      background="gray"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard
          v-for="post in latestPosts"
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
      
      <div class="text-center mt-8">
        <Button variant="primary" size="lg" @click="navigateToPosts">
          View All Posts
        </Button>
      </div>
    </Section>

    <!-- Discord Widget -->
    <Section background="white">
      <div class="flex justify-center">
        <iframe
          src="https://discord.com/widget?id=1261615456209469440&theme=dark"
          width="350"
          height="500"
          allowtransparency="true"
          frameborder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          class="rounded-lg shadow-lg"
        />
      </div>
    </Section>

    <!-- CTA Section -->
    <Section
      title="Get Involved"
      subtitle="Join our community and help make Cache Valley an even better place to live, work, and play."
      background="primary"
    >
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="secondary" size="lg" @click="navigateToOrganizations">
          Partner With Us
        </Button>
        <Button variant="outline" size="lg" @click="navigateToPosts">
          Stay Informed
        </Button>
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Organization, Post } from '@/types'
import { ApiService } from '@/services/api'
import Hero from '@/components/ui/Hero.vue'
import Section from '@/components/ui/Section.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()

// Reactive data
const featuredOrganizations = ref<Organization[]>([])
const latestPosts = ref<Post[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const heroActions = [
  {
    text: 'Explore Organizations',
    variant: 'primary' as const,
    size: 'lg' as const,
    onClick: () => navigateToOrganizations()
  },
  {
    text: 'Read Latest Posts',
    variant: 'secondary' as const,
    size: 'lg' as const,
    onClick: () => navigateToPosts()
  }
]

const navigateToOrganizations = () => {
  router.push('/organizations')
}

const navigateToPosts = () => {
  router.push('/posts')
}

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch organizations and posts in parallel
    const [organizations, posts] = await Promise.all([
      ApiService.getOrganizations(),
      ApiService.getPosts()
    ])

    // Get first 3 organizations for featured section
    featuredOrganizations.value = organizations.slice(0, 3)
    
    // Get first 6 posts for latest section
    latestPosts.value = posts.slice(0, 6)

  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
