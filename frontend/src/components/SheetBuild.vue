<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
const championStore = useChampionStore()
import version from '@/assets/files/lastVersion.json'
</script>

<template>
  <div data-v-c3d704f8="" class="sheet champions">
    <div data-v-7a29d415="" data-v-c3d704f8="" class="sheet">
      <div data-v-7a29d415="" class="wrap">
        <div data-v-7a29d415="" class="shadow"></div>
        <div
          data-v-de17e6dc=""
          data-v-45896cfe=""
          data-v-92fb197b=""
          data-v-7a29d415=""
          class="tooltip"
        >
          <div
            data-v-92fb197b=""
            data-v-de17e6dc-s=""
            :class="[
              'champion',
              { hide: !championStore.selectedChampionImage },
            ]"
          >
            <img
              v-if="championStore.selectedChampionImage"
              data-v-6024a556=""
              data-v-de17e6dc-s=""
              alt="{{champion.name}}"
              :src="
                'https://ddragon.leagueoflegends.com/cdn/' +
                version +
                '/img/champion/' +
                championStore.selectedChampionImage
              "
            />
          </div>
        </div>
        <div
          data-v-7a29d415=""
          class="name"
          v-if="championStore.selectedChampionName"
        >
          {{ championStore.selectedChampionName }}
        </div>
        <hr data-v-7a29d415="" class="hide" />
        <hr data-v-7a29d415="" class="hide" />
        <div data-v-7a29d415="" class="itemsGroup">
          <div data-v-7a29d415="" class="items"></div>
          <div data-v-7a29d415="" class="sums hide">
            <div data-v-7a29d415="" class="hide sum">
              <div data-v-7a29d415="" class="wrap"></div>
            </div>
            <div data-v-7a29d415="" class="hide sum">
              <div data-v-7a29d415="" class="wrap"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
