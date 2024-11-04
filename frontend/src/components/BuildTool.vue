<script setup lang="ts">
import ChampSelection from '@/components/ChampSelection.vue'
import RuneSelection from '@/components/RuneSelection.vue'
import { useChampionStore } from '@/stores/championStore'
import SheetBuild from './SheetBuild.vue'

const championStore = useChampionStore()
</script>

<template>
  <div class="app" data-v-f2a5836d="">
    <div class="champions main" data-v-f2a5836d="">
      <div class="build" data-v-f2a5836d="" data-v-c3d704f8="">
        <div data-v-c3d704f8="" class="menu">
          <a
            data-v-c3d704f8=""
            aria-current="page"
            href="/build/champions"
            class="router-link-active router-link-exact-active"
          >
            Champions
          </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/runes" class="">
            <span data-v-c3d704f8="" class="long">
              Runes &amp; Summoner spells</span
            >
            <span data-v-c3d704f8="" class="short"> Runes </span></a
          >
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/items" class=""> Items </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/info" class=""> Info </a>
        </div>
        <div
          v-if="!championStore.selectedChampionImage"
          data-v-c3d704f8=""
          class="main"
        >
          <ChampSelection />
        </div>
        <div v-else data-v-c3d704f8="" class="main">
          <RuneSelection />
        </div>

        <SheetBuild />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
