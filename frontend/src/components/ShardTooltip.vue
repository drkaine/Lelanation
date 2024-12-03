<script setup lang="ts">
import { type Shard } from './type'

const props = defineProps<{
  shard: Shard
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
