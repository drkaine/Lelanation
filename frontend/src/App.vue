<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/lastVersion.json'
</script>

<template>
  <header>
    <div class="wrapper" data-v-f2a5836d="" data-v-7cc930f8="">
      <div class="header" data-v-f2a5836d="" data-v-7cc930f8="">
        <RouterLink to="/">Home</RouterLink>
        <div class="overlay" data-v-7cc930f8=""></div>
        <button class="menu" data-v-7cc930f8="">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-v-7cc930f8=""
          >
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </button>
        <div class="right" data-v-7cc930f8="">
          <!-- <RouterLink to="/build"> Building</RouterLink> -->
          <RouterLink to="/champions">Champions</RouterLink>
          <RouterLink to="/runes">Runes</RouterLink>
          <RouterLink to="/items">Items</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <a
            href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes/"
            title="Patch Notes"
            target="_blank"
            class="version"
            data-v-7cc930f8=""
            >{{ version }}</a
          >
          <span data-v-7cc930f8="">•</span>
          <a
            href="https://sybo.dev"
            target="_blank"
            title="sybo.dev"
            data-v-7cc930f8=""
            >@darkaine</a
          >
        </div>
      </div>
    </div>
  </header>

  <RouterView />
</template>
