<template>
  <section :class="sectionClasses">
    <div class="container">
      <div v-if="title || subtitle" class="text-center mb-12">
        <h2 v-if="title" class="section-title">{{ title }}</h2>
        <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
      </div>
      
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  subtitle?: string
  background?: 'white' | 'gray' | 'primary'
  padding?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  background: 'white',
  padding: 'md'
})

const sectionClasses = computed(() => {
  const baseClasses = 'section'
  
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-50'
  }[props.background]
  
  const paddingClasses = {
    sm: 'py-8',
    md: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-24'
  }[props.padding]
  
  return [baseClasses, backgroundClasses, paddingClasses].join(' ')
})
</script>
