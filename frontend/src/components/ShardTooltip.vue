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
    style="position: absolute; left: -32px; top: 53px"
  >
    <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="header">
      <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="img">
        <img
          data-v-ab218c16=""
          data-v-cbff5ddf-s=""
         :src="`/assets/icons/${$props.shard.image}`"
        />
      </div>
      <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="name">
        {{ $props.shard.description }}
      </div>
    </div>
  </div>
</template>