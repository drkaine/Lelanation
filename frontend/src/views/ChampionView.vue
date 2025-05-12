<script setup lang="ts">
import ChampSelection from '@/components/Selection/ChampSelection.vue'
import MenuBuild from '@/components/composants/MenuBuild.vue'
</script>

<template>
  <div class="main champions">
    <div class="build">
      <MenuBuild />
      <div class="main">
        <ChampSelection />
        <div class="next">
          <button>{{ $t('button.next') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
