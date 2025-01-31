<script setup lang="ts">
import ExcelViewer from '@vue-office/excel'
import { ref } from 'vue'

const loading = ref(false)
const error = ref<string | null>(null)
</script>

<template>
  <div class="excel-container">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <ExcelViewer
      :src="'../../../public/assets/files/tier-listes/test.xlsx'"
      @loading="loading = true"
      @load-error="error = $event"
      @loaded="loading = false"
      style="height: 80vh"
    />
    <div v-if="loading" class="loading">Chargement en cours...</div>
  </div>
</template>

<style scoped>
.excel-container {
  width: var(--width-all);
  height: var(--height-all);
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.error-message {
  color: red;
  padding: 20px;
  text-align: center;
}
</style>
