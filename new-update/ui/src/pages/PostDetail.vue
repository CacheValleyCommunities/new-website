<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading post...</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else-if="!post" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p class="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
        <Button variant="primary" @click="goBack">Go Back</Button>
      </div>
    </div>

    <!-- Post Details -->
    <div v-else>
      <!-- Hero Section -->
      <Section background="primary" padding="lg">
        <div class="max-w-4xl mx-auto text-center">
          <div v-if="post.categories.length" class="mb-4">
            <span class="inline-block px-3 py-1 text-sm font-medium bg-primary-200 text-primary-800 rounded-full">
              {{ post.categories[0] }}
            </span>
          </div>
          
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6">{{ post.title }}</h1>
          
          <div class="flex items-center justify-center space-x-6 text-primary-100">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(post.date) }}</span>
            </div>
            
            <div v-if="post.tags.length" class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ post.tags.slice(0, 2).join(', ') }}</span>
            </div>
          </div>
        </div>
      </Section>

      <!-- Featured Image -->
      <div v-if="post.image" class="bg-gray-100">
        <div class="container py-8">
          <img
            :src="post.image"
            :alt="post.title"
            class="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <!-- Content -->
      <Section background="white">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none">
            <p class="text-xl text-gray-600 leading-relaxed mb-8">
              {{ post.summary }}
            </p>
            
            <!-- In a real app, this would be rendered markdown content -->
            <div class="prose prose-lg max-w-none">
              <p>{{ post.content || 'This is where the full post content would be displayed. In a real application, this would be rendered from markdown or rich text content.' }}</p>
            </div>
          </div>
        </div>
      </Section>

      <!-- Tags -->
      <Section background="gray" v-if="post.tags.length">
        <div class="max-w-4xl mx-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-3 py-1 text-sm bg-white text-gray-600 rounded-full border border-gray-200"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </Section>

      <!-- Related Posts -->
      <Section background="white" v-if="relatedPosts.length > 0">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Related Posts</h2>
          <p class="text-lg text-gray-600">You might also be interested in these posts</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ContentCard
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.id"
            :title="relatedPost.title"
            :description="relatedPost.summary"
            :image="relatedPost.image"
            :category="relatedPost.categories[0]"
            :tags="relatedPost.tags"
            :date="relatedPost.date"
            :link="`/posts/${relatedPost.slug}`"
          />
        </div>
      </Section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Post } from '@/types'
import Section from '@/components/ui/Section.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const router = useRouter()

const post = ref<Post | null>(null)
const relatedPosts = ref<Post[]>([])
const loading = ref(true)

const goBack = () => {
  router.push('/posts')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - in a real app, this would come from an API
    const posts: Post[] = [
      {
        id: '1',
        title: 'Cache Tech Community Meetup - January 2025',
        slug: 'cache-tech-meetup-january-2025',
        summary: 'Join us on Jan 25, 2025, at 1:30 PM (MST) at Logan Library for a tech meetup! The event features an open discussion on tech careers and a deep dive into mobile forensics, including an iPhone forensic demo. Open to all skill levels—come learn and connect!',
        content: 'Join our Discord community to stay connected with fellow tech enthusiasts!\n\nJoin us on Jan 25, 2025, at 1:30 PM (MST) at Logan Library for a tech meetup! The event features an open discussion on tech careers and a deep dive into mobile forensics, including an iPhone forensic demo. Open to all skill levels—come learn and connect!\n\n## Event Details:\n- **Date**: Saturday, January 25, 2025\n- **Time**: 1:30 PM – 2:45 PM (MST)\n- **Location**: Community Room A, Logan Library\n\nWe\'ve got an exciting new format this month! Here\'s what you can expect:\n\n## Part 1: General Meetup (45 minutes)\n\nWe\'ll kick things off with an open discussion on navigating the tech world. Whether you\'re pursuing formal education, self-learning, or growing through community-driven opportunities, we\'d love to hear your story! This is your chance to share experiences, exchange ideas, and explore potential mentorship opportunities.\n\n**All skill levels and ages are welcome—there\'s something for everyone!**\n\n## Part 2: Technical Deep Dive (45 minutes)\n\nIn the second half, we\'ll dive into the fascinating world of **mobile forensics**! We\'ll host a live demonstration on performing forensic analysis of an iPhone using the **Mobile Verification Toolkit (MVT)**, a powerful tool for identifying spyware and malware.\n\n**Key highlights include:**\n- Creating and decrypting local backups of iOS devices.\n- Scanning backups for signs of spyware or malicious software.\n- Analyzing common attack vectors for mobile devices.\n- A live demo showcasing how an iPhone can be compromised in under 30 minutes.\n- Discussion on mobile malware detection and mitigation strategies for iOS and Android.\n- Examining the security risks posed by the environment-sensing features of mobile devices.\n\n## Who Should Attend?\n\nThis event is open to everyone—no exceptions! Whether you\'re a beginner, self-taught, or an experienced tech professional, there\'s something here for you.\n\nBring your curiosity, questions, and enthusiasm—let\'s learn, connect, and grow together!\n\n**Stay tuned for further updates** on the event\'s time and location. We look forward to seeing you there!\n\n---\n\nWe\'re excited for the return of the Cache Tech Community, and we can\'t wait to kick off the year with all of you!',
        date: '2025-01-18',
        image: 'image_870x_67799e80a280c.jpg',
        categories: ['Communities', 'Events'],
        tags: ['Mobile Forensics', 'Community Event', 'Cache Tech Community', 'Cyber Security', 'Tech']
      },
      {
        id: '2',
        title: 'Why You Should Join Our Discord',
        slug: 'why-you-should-join-our-discord',
        summary: 'Discover the benefits of joining our Discord community and how it can help you connect with fellow tech enthusiasts.',
        content: 'Our Discord community is the heart of Cache Valley Communities. Here\'s why you should join us...',
        date: '2025-01-15',
        categories: ['Community'],
        tags: ['Discord', 'Community Engagement', 'Networking']
      },
      {
        id: '3',
        title: 'IT STEM Summer Camp',
        slug: 'it-stem-summer-camp',
        summary: 'Join us for an exciting IT STEM summer camp designed for 9th grade students interested in technology and computer science.',
        content: 'We\'re excited to announce our IT STEM Summer Camp for 9th grade students...',
        date: '2025-01-12',
        categories: ['Education'],
        tags: ['IT STEM', 'Summer Camp', 'Education', 'Technology']
      }
    ]
    
    post.value = posts.find(p => p.slug === props.slug) || null
    
    // Mock related posts
    if (post.value) {
      relatedPosts.value = posts
        .filter(p => p.id !== post.value?.id && p.categories.some(cat => post.value?.categories.includes(cat)))
        .slice(0, 3)
    }
  } catch (error) {
    console.error('Failed to load post:', error)
  } finally {
    loading.value = false
  }
})
</script>
