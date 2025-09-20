<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left" />
    <span v-if="$slots.default">
      <slot />
    </span>
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = 'btn'
  const variantClasses = `btn-${props.variant}`
  const sizeClasses = `btn-${props.size}`
  const widthClasses = props.fullWidth ? 'w-full' : ''
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [baseClasses, variantClasses, sizeClasses, widthClasses, disabledClasses].filter(Boolean).join(' ')
})
</script>
