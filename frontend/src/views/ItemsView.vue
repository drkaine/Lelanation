<script setup lang="ts">
import ItemsSelection from '@/components/Selection/ItemsSelection.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
import SheetBuild from '@/components/composants/SheetBuild.vue'
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
    </div>
  </div>
</template>
