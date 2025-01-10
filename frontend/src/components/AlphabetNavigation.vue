<script setup lang="ts">
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

interface Props {
  currentLetter: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', letter: string): void
}>()
</script>

<template>
  <div class="alphabet-nav">
    <button
      v-for="letter in alphabet"
      :key="letter"
      :class="['letter-btn', { active: currentLetter === letter }]"
      @click="emit('select', letter)"
    >
      {{ letter }}
    </button>
  </div>
</template>
