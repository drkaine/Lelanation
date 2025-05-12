<script setup lang="ts">
import ItemsSelection from '@/components/Selection/ItemsSelection.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
</script>

<template>
  <div class="main champions">
    <div class="build">
      <MenuBuild />
      <div class="main">
        <ItemsSelection />
        <div class="next">
          <button>{{ $t('button.next') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
