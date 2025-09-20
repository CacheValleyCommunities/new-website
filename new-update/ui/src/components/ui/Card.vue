<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    
    <div v-if="$slots.default || description" class="card-body">
      <slot>
        <p v-if="description" class="text-gray-600">{{ description }}</p>
      </slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  hover: true,
  padding: 'md'
})

const cardClasses = computed(() => {
  const baseClasses = 'card'
  const hoverClasses = props.hover ? 'hover:shadow-md' : ''
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[props.padding]
  
  return [baseClasses, hoverClasses, paddingClasses].filter(Boolean).join(' ')
})
</script>
