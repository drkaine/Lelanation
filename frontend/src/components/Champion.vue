<script setup lang="ts">
import ChampSelection from '@/components/ChampSelection.vue'

</script>

<template>
  <div class="app" data-v-f2a5836d="">
    <div class="main" data-v-f2a5836d="">
      <div class="build" data-v-f2a5836d="" data-v-c3d704f8="">
        <div data-v-c3d704f8="" class="menu">
          <a
            data-v-c3d704f8=""
            aria-current="page"
            href="/infos/champions"
            class="router-link-active router-link-exact-active"
          >
            Champions
          </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/infos/runes" class="">
            <span data-v-c3d704f8="" class="long">
              Runes &amp; Summoner spells</span
            >
            <span data-v-c3d704f8="" class="short"> Runes </span></a
          >
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/infos/items" class=""> Items </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/infos/info" class=""> Info </a>
        </div>
        <div
        
          data-v-c3d704f8=""
          class="main"
        >
          <ChampSelection />
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped></style>
