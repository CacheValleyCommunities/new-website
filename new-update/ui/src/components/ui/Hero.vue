<template>
  <section class="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 lg:py-24">
    <div class="container">
      <div class="flex flex-col lg:flex-row items-center gap-12">
        <!-- Content -->
        <div class="flex-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {{ title }}
            <span v-if="subtitle" class="block text-primary-600">{{ subtitle }}</span>
          </h1>
          
          <p class="text-xl text-gray-600 mb-8 max-w-2xl">
            {{ description }}
          </p>
          
          <div v-if="actions && actions.length" class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button
              v-for="action in actions"
              :key="action.text"
              :variant="action.variant || 'primary'"
              :size="action.size || 'lg'"
              @click="handleAction(action)"
            >
              {{ action.text }}
            </Button>
          </div>
        </div>
        
        <!-- Image -->
        <div v-if="image" class="flex-1 max-w-lg">
          <img
            :src="image"
            :alt="imageAlt"
            class="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from './Button.vue'

interface Action {
  text: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
}

interface Props {
  title: string
  subtitle?: string
  description: string
  image?: string
  imageAlt?: string
  actions?: Action[]
}

const props = defineProps<Props>()

const handleAction = (action: Action) => {
  if (action.onClick) {
    action.onClick()
  } else if (action.href) {
    window.location.href = action.href
  }
}
</script>
