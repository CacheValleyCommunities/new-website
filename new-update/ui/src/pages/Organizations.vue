<template>
  <div>
    <!-- Page Header -->
    <Section background="primary" padding="lg">
      <div class="text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6">Organizations</h1>
        <p class="text-xl text-primary-100 max-w-3xl mx-auto">
          Discover the amazing organizations making a difference in Cache Valley. 
          From tech communities to social services, find your place to connect and contribute.
        </p>
      </div>
    </Section>

    <!-- Organizations Grid -->
    <Section background="white">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600">Loading organizations...</p>
      </div>

      <div v-else-if="organizations.length === 0" class="text-center py-12">
        <p class="text-gray-600">No organizations found.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ContentCard
          v-for="org in organizations"
          :key="org.id"
          :title="org.title"
          :description="org.summary"
          :image="org.image"
          :category="'Organization'"
          :date="org.date"
          :link="`/organizations/${org.slug}`"
        />
      </div>
    </Section>

    <!-- Call to Action -->
    <Section background="gray">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Want to List Your Organization?</h2>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We're always looking to connect with new organizations in Cache Valley. 
          If you'd like to be featured on our platform, we'd love to hear from you.
        </p>
        <Button variant="primary" size="lg" @click="contactUs">
          Get In Touch
        </Button>
      </div>
    </Section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Organization } from '@/types'
import { ApiService } from '@/services/api'
import Section from '@/components/ui/Section.vue'
import ContentCard from '@/components/ui/ContentCard.vue'
import Button from '@/components/ui/Button.vue'

const organizations = ref<Organization[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const contactUs = () => {
  window.location.href = 'mailto:info@cachevalley.co'
}

const fetchOrganizations = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await ApiService.getOrganizations()
    organizations.value = data
  } catch (err) {
    console.error('Failed to load organizations:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load organizations'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrganizations()
})
</script>
