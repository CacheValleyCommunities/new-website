<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading organization...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!organization" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
        <p class="text-gray-600 mb-8">The organization you're looking for doesn't exist.</p>
        <Button variant="primary" @click="goBack">Go Back</Button>
      </div>
    </div>

    <!-- Organization Details -->
    <div v-else>
      <!-- Hero Section -->
      <Section background="primary" padding="lg">
        <div class="text-center">
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6">{{ organization.title }}</h1>
          <p class="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
            {{ organization.summary }}
          </p>
          <div v-if="organization.website" class="flex justify-center">
            <Button variant="secondary" size="lg" @click="visitWebsite">
              Visit Website
            </Button>
          </div>
        </div>
      </Section>

      <!-- Content -->
      <Section background="white">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none">
            <p class="text-lg text-gray-600 leading-relaxed">
              {{ organization.description || organization.summary }}
            </p>
          </div>
        </div>
      </Section>

      <!-- Related Posts -->
      <Section background="gray" v-if="relatedPosts.length > 0">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Related Posts</h2>
          <p class="text-lg text-gray-600">Posts related to {{ organization.title }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            v-for="post in relatedPosts"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Organization, Post } from '@/types'
import Section from '@/components/ui/Section.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

const organization = ref<Organization | null>(null)
const relatedPosts = ref<Post[]>([])
const loading = ref(true)

const goBack = () => {
  router.push('/organizations')
}

const visitWebsite = () => {
  if (organization.value?.website) {
    window.open(organization.value.website, '_blank', 'noopener,noreferrer')
  }
}

onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - in a real app, this would come from an API
    const organizations: Organization[] = [
      {
        id: '1',
        title: 'Cache Valley Communities',
        slug: 'cachevalleycommunities',
        summary: 'A volunteer-led effort helping neighbors in Cache Valley connect, learn, and collaborate through meetups, workshops, and shared resources—linking people with the local groups that already exist.',
        description: 'Cache Valley is full of people doing good work—neighbors, clubs, nonprofits, and small teams with skills to share. What\'s often missing is an easy way to find each other. Cache Valley Communities exists to make those connections simple.\n\nWe\'re a volunteer-run group that creates chances for people to connect, learn, and build together. No memberships, no gatekeeping—just a welcoming space to meet others and swap knowledge.',
        website: 'https://cachevalley.co/',
        date: '2025-02-18'
      },
      {
        id: '2',
        title: 'DC435',
        slug: 'dc435',
        summary: 'A cybersecurity community focused on education, networking, and professional development in the Cache Valley area.',
        description: 'DC435 is dedicated to advancing cybersecurity knowledge and practices through community engagement, educational events, and professional networking opportunities.',
        website: 'https://dc435.org/',
        date: '2025-01-15'
      },
      {
        id: '3',
        title: 'WAB Warming Center',
        slug: 'wab-warming-center',
        summary: 'Providing warmth, shelter, and support to those in need during cold weather months in Cache Valley.',
        description: 'The WAB Warming Center provides essential services to community members experiencing homelessness or housing insecurity during the winter months.',
        website: 'https://wabwarmingcenter.org/',
        date: '2025-01-10'
      }
    ]
    
    organization.value = organizations.find(org => org.slug === props.slug) || null
    
    // Mock related posts
    if (organization.value) {
      relatedPosts.value = [
        {
          id: '1',
          title: 'Cache Tech Community Meetup - January 2025',
          slug: 'cache-tech-meetup-january-2025',
          summary: 'Join us for a tech meetup featuring mobile forensics and career discussions.',
          content: '',
          date: '2025-01-18',
          categories: ['Communities', 'Events'],
          tags: ['Mobile Forensics', 'Community Event', 'Cache Tech Community']
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load organization:', error)
  } finally {
    loading.value = false
  }
})
</script>
