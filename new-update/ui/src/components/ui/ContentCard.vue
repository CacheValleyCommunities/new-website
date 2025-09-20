<template>
  <div class="card group cursor-pointer" @click="handleClick">
    <div v-if="image" class="aspect-w-16 aspect-h-9">
      <img
        :src="image"
        :alt="title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      />
    </div>
    
    <div class="card-body">
      <div v-if="category" class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
        {{ category }}
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ title }}
      </h3>
      
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ description }}
      </p>
      
      <div v-if="tags && tags.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
        >
          {{ tag }}
        </span>
        <span v-if="tags.length > 3" class="px-2 py-1 text-xs text-gray-400">
          +{{ tags.length - 3 }} more
        </span>
      </div>
      
      <div class="flex items-center justify-between">
        <div v-if="date" class="text-sm text-gray-500">
          {{ formatDate(date) }}
        </div>
        
        <div class="flex items-center text-primary-600 group-hover:text-primary-700">
          <span class="text-sm font-medium">Learn More</span>
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardProps } from '@/types'

interface Props extends CardProps {
  onClick?: () => void
}

const props = defineProps<Props>()

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  } else if (props.link) {
    window.location.href = props.link
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
