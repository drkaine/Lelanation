<script setup lang="ts">
import type { Shard } from '@/types/shard'

const props = defineProps<{
  shard: Shard
}>()
</script>

<template>
  <div data-v-cbff5ddf="" class="body">
    <span data-v-ad54ad37="" data-v-cbff5ddf-s="">
      {{ props.shard.description }}
    </span>
  </div>
</template>
