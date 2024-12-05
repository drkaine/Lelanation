<script setup lang="ts">
import SheetBuild from '@/components/SheetBuild.vue'
import Extra from '@/components/ExtraInfo.vue'
import MenuBuild from '@/components/MenuBuild.vue'
import ItemsSelection from '@/components/ItemsSelection.vue'
</script>

<template>
  <div data-v-f21e856a="" class="main champions">
    <div data-v-b6709614="" data-v-f21e856a="" class="build">
      <MenuBuild />
      <div data-v-b6709614="" class="main">
        <ItemsSelection />
        <div data-v-b6709614="" class="next">
          <button data-v-b6709614="">Next</button>
        </div>
      </div>
      <SheetBuild />
      <Extra />
    </div>
  </div>
</template>

<style scoped></style>
