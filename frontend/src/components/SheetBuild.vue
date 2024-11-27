<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
const championStore = useChampionStore()
import version from '@/assets/files/lastVersion.json'
</script>

<template>
  <div data-v-b6709614="" class="sheet champions">
    <div
      data-v-15310f80=""
      data-v-b6709614=""
      class="sheet"
      style="
        --971f605c: oklch(70% 0.1 230);
        --1180920d: linear-gradient(
          135deg,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            0%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            50%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            50%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            100%
        );
        --1c64872f: linear-gradient(
          135deg,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            0%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            50%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            50%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            100%
        );
      "
    >
      <div data-v-15310f80="" class="type"></div>
      <div data-v-15310f80="" class="version">{{ version }}</div>
      <div data-v-15310f80="" class="wrap">
        <div data-v-15310f80="" class="shadow"></div>
        <div data-v-15310f80="" class="champion">
          <div
            data-v-cbff5ddf=""
            data-v-5bc51be1=""
            data-v-1f02dc05=""
            data-v-15310f80=""
            class="tooltip"
            v-if="championStore.selectedChampionName"
          >
            <div data-v-1f02dc05="" data-v-cbff5ddf-s="" class="champion">
              <img
                data-v-1f02dc05=""
                data-v-cbff5ddf-s=""
                :src="
                  'https://ddragon.leagueoflegends.com/cdn/' +
                  version +
                  '/img/champion/' +
                  championStore.selectedChampionImage
                "
              />
            </div>
            <div
              data-v-cbff5ddf=""
              class="box"
              style="position: absolute; left: 79px; top: 91px"
            >
              <!-- tooltip -->
            </div>
          </div>
        </div>
        <div data-v-15310f80="" class="name">
          {{ championStore.selectedChampionName }}
        </div>
        <hr data-v-15310f80="" class="hide" />
        <hr data-v-15310f80="" class="hide" />
        <div data-v-15310f80="" class="itemsGroup">
          <div data-v-15310f80="" class="items"></div>
          <div data-v-15310f80="" class="sums hide"></div>
        </div>
      </div>
    </div>
  </div>
</template>
