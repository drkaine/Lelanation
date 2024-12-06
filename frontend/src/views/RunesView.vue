<script setup lang="ts">
import RunesSelection from '@/components/Selection/RunesSelection.vue'
import MenuBuild from '@/components/MenuBuild.vue'
import SheetBuild from '@/components/SheetBuild.vue'
</script>

<template>
  <div data-v-f21e856a="" class="main champions">
    <div data-v-b6709614="" data-v-f21e856a="" class="build">
      <MenuBuild />
      <div data-v-b6709614="" class="main">
        <RunesSelection />
        <div data-v-b6709614="" class="next">
          <button data-v-b6709614="">Next</button>
        </div>
      </div>
      <SheetBuild />
    </div>
  </div>
</template>
