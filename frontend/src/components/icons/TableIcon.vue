<template>
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :style="style"
  >
    <title>Table</title>
    <path
      fill="currentColor"
      d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v3h14V5H5zm0 5v4h4v-4H5zm6 0v4h4v-4h-4zm6 0v4h2v-4h-2zM5 16v3h4v-3H5zm6 0v3h4v-3h-4zm6 0v3h2v-3h-2z"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  width?: string | number
  height?: string | number
  style?: string
}

withDefaults(defineProps<Props>(), {
  width: '24',
  height: '24',
  style: 'min-width: 24px; min-height: 24px',
})
</script>
