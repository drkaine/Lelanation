<script setup lang="ts">
const props = defineProps<{
  shard: {
    image: string
    description: string
  }
}>()
</script>

<template>
  <div
    data-v-cbff5ddf=""
    class="box"
    style="position: absolute; left: -30px; top: -31px"
  >
    <div data-v-cbff5ddf="" class="body">
      <span data-v-ad54ad37="" data-v-cbff5ddf-s="">
        {{ props.shard.description }}
      </span>
    </div>
  </div>
</template>
