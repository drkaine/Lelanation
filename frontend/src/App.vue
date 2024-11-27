<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import version from '@/assets/files/lastVersion.json'
</script>

<template>
  <div id="app" data-server-rendered="true" data-v-app="">
    <div
      data-v-f21e856a=""
      class="app"
      style="
        --6d8341ae: linear-gradient(
          135deg,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 0%
            )
            0%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 0%
            )
            5%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 5%
            )
            5%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 5%
            )
            10%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 10%
            )
            10%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 10%
            )
            15%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 15%
            )
            15%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 15%
            )
            20%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 20%
            )
            20%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 20%
            )
            25%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 25%
            )
            25%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 25%
            )
            30%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 30%
            )
            30%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 30%
            )
            35%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 35%
            )
            35%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 35%
            )
            40%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 40%
            )
            40%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 40%
            )
            45%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 45%
            )
            45%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 45%
            )
            50%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 50%
            )
            50%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 50%
            )
            55%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 55%
            )
            55%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 55%
            )
            60%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 60%
            )
            60%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 60%
            )
            65%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 65%
            )
            65%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 65%
            )
            70%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 70%
            )
            70%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 70%
            )
            75%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 75%
            )
            80%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 80%
            )
            80%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 80%
            )
            85%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 85%
            )
            85%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 85%
            )
            90%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 90%
            )
            90%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 90%
            )
            95%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 95%
            )
            95%,
          color-mix(
              in srgb,
              oklch(17% 0.05 230),
              color-mix(in srgb, var(--black), black 40%) 95%
            )
            100%
        );
      "
    >
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
          <a data-v-7cc930f8="" href="/pro" class=""> Pro Builds</a>
          <span data-v-7cc930f8="">•</span>
          <a data-v-7cc930f8="" href="/randomizer" class="">Random</a>
          <span data-v-7cc930f8="">•</span>
          <a data-v-7cc930f8="" href="/items" class="active"> Items</a>
          <span data-v-7cc930f8="">•</span>
          <RouterLink to="/build"> Building</RouterLink>
          <span data-v-7cc930f8="">•</span>
          <a data-v-7cc930f8="" href="/builds" class=""> My Builds</a>
          <span data-v-7cc930f8="">•</span>
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
