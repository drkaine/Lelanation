<script setup lang="ts">
import RunesSelection from '@/components/Selection/RunesSelection.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
</script>

<template>
  <div class="main champions">
    <div class="build">
      <MenuBuild />
      <div class="main">
        <RunesSelection />
        <div class="next">
          <button>{{ $t('button.next') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
