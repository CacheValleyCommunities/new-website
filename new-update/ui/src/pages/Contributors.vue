<template>
  <div>
    <!-- Page Header -->
    <Section background="primary" padding="lg">
      <div class="text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6">Contributors</h1>
        <p class="text-xl text-primary-100 max-w-3xl mx-auto">
          Meet the amazing people who make Cache Valley Communities possible. 
          Our contributors come from diverse backgrounds and bring unique skills to our community.
        </p>
      </div>
    </Section>

    <!-- Contributors Grid -->
    <Section background="white">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading contributors...</p>
      </div>

      <div v-else-if="contributors.length === 0" class="text-center py-12">
        <p class="text-gray-600">No contributors found.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="contributor in contributors"
          :key="contributor.id"
          class="card text-center"
        >
          <div class="card-body">
            <div class="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <img
                v-if="contributor.avatar"
                :src="contributor.avatar"
                :alt="contributor.name"
                class="w-24 h-24 rounded-full object-cover"
              />
              <span v-else class="text-2xl font-bold text-gray-600">
                {{ contributor.name.charAt(0) }}
              </span>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ contributor.name }}</h3>
            <p class="text-primary-600 font-medium mb-4">{{ contributor.role }}</p>
            <p class="text-gray-600 mb-6">{{ contributor.bio }}</p>
            
            <div v-if="contributor.github || contributor.twitter || contributor.linkedin" class="flex justify-center space-x-4">
              <a
                v-if="contributor.github"
                :href="contributor.github"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                v-if="contributor.twitter"
                :href="contributor.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                v-if="contributor.linkedin"
                :href="contributor.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- Call to Action -->
    <Section background="gray">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Want to Contribute?</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We're always looking for passionate individuals to help grow our community. 
          Whether you have technical skills, organizational expertise, or just want to help out, we'd love to hear from you.
        </p>
        <Button variant="primary" size="lg" @click="contactUs">
          Get Involved
        </Button>
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Contributor } from '@/types'
import { ApiService } from '@/services/api'
import Section from '@/components/ui/Section.vue'
import Button from '@/components/ui/Button.vue'

const contributors = ref<Contributor[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const contactUs = () => {
  window.location.href = 'mailto:info@cachevalley.co'
}

const fetchContributors = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await ApiService.getContributors()
    contributors.value = data
  } catch (err) {
    console.error('Failed to load contributors:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load contributors'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchContributors()
})
</script>
