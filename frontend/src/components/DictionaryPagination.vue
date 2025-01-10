<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'change', page: number): void
}>()
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="emit('change', currentPage - 1)"
      class="page-btn"
    >
      Précédent
    </button>
    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
    <button
      :disabled="currentPage === totalPages"
      @click="emit('change', currentPage + 1)"
      class="page-btn"
    >
      Suivant
    </button>
  </div>
</template>
