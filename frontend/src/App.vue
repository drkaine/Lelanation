<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/lastVersion.json'
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <div data-v-f21e856a="" class="app app-background" style="">
      <div data-v-7cc930f8="" data-v-f21e856a="" class="header">
        <a data-v-7cc930f8="" href="/" class="name">Acceuil</a>
        <div data-v-7cc930f8="" class="overlay"></div>
        <button data-v-7cc930f8="" class="menu">
          <svg
            data-v-7cc930f8=""
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 6l16 0"></path>
            <path d="M4 12l16 0"></path>
            <path d="M4 18l16 0"></path>
          </svg>
        </button>
        <div data-v-7cc930f8="" class="right">
          <!-- <RouterLink to="/champions">Champions</RouterLink>
          <RouterLink to="/runes">Runes</RouterLink>
          <RouterLink to="/items">Items</RouterLink> -->
          <!-- <a data-v-7cc930f8="" href="/pro" class=""> Pro Builds</a>
          <span data-v-7cc930f8="">•</span>
          <a data-v-7cc930f8="" href="/randomizer" class="">Random</a> -->
          <!-- <span data-v-7cc930f8="">•</span>
          <a data-v-7cc930f8="" href="/items" class="active"> Items</a>
          <span data-v-7cc930f8="">•</span> -->
          <RouterLink to="/dictionnaire"> Leladictionnaiva</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <!-- <RouterLink to="/build"> Lelariva reviews</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <RouterLink to="/build"> Le lobbyrivas</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <RouterLink to="/build"> Lelariguidevas</RouterLink>
          <span data-v-7cc930f8="">•</span>-->
          <!-- <RouterLink to="/tier-list"> Lela tierlistas</RouterLink>
          <span data-v-7cc930f8="">•</span> -->
          <!--<RouterLink to="/build"> Le metarivas</RouterLink>
          <span data-v-7cc930f8="">•</span> -->
          <RouterLink to="/build"> Building</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <RouterLink to="/build"> Lelaribuilds</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <!-- <a data-v-7cc930f8="" href="/builds" class=""> My Builds</a>
          <span data-v-7cc930f8="">•</span> -->
          <a
            data-v-7cc930f8=""
            href="https://www.leagueoflegends.com/fr-fr/news/tags/patch-notes"
            title="Patch Notes"
            target="_blank"
            class="version"
            >{{ version }}</a
          >
          <span data-v-7cc930f8="">•</span>
          <a
            data-v-7cc930f8=""
            href="https://github.com/drkaine"
            target="_blank"
            title="sybo.dev"
          >
            @darkaine</a
          >
        </div>
      </div>
      <RouterView />
    </div>
  </div>
</template>
