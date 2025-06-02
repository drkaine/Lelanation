<template>
  <component
    :is="headingLevel"
    :class="titleClass"
    :itemprop="structured ? 'headline' : undefined"
  >
    <slot>{{ title }}</slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  structured?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  structured: true,
  class: 'title',
})

const headingLevel = computed(() => `h${props.level}`)
const titleClass = computed(() => props.class)
</script>

<script lang="ts">
import { computed } from 'vue'

export default {
  name: 'PageTitle',
}
</script>
