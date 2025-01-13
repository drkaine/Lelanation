<script setup lang="ts">
import { useItemStore } from '@/stores/itemStore'
import statsTrad from '../../../public/assets/files/statsTrad.json'

const itemStore = useItemStore()
const getTrad = (name: string) => {
  return statsTrad[name as keyof typeof statsTrad]
}

const removeItem = (index: number) => {
  itemStore.removeItem(index)
}
</script>

<template>
  <div data-v-b6709614="" class="extra" id="extra">
    <div data-v-63d61340="" data-v-6a781413="" class="picks">
      <div data-v-63d61340="" class="list">
        <div
          data-v-1875b585=""
          data-v-63d61340=""
          class="pick-item"
          v-for="(item, index) in itemStore.ItemsSelection.core"
          :key="index"
        >
          <div
            data-v-354b7b55=""
            data-v-7ab6e59a=""
            data-v-1875b585=""
            class="tip"
          >
            <button
              data-v-7ab6e59a=""
              to="false"
              class="item"
              replace="false"
              @click="removeItem(index)"
            >
              <img
                data-v-7ab6e59a=""
                class="img"
                :src="`/assets/icons/items/${item.image.full}`"
                :alt="item.name"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div data-v-6a781413="" class="extra-stats">
      <div data-v-636d16e0="" data-v-6a781413="" class="stats">
        <div data-v-636d16e0="" class="list">
          <div data-v-636d16e0="" class="labels">
            <div data-v-636d16e0="" class="label column">total</div>
          </div>
          <div
            data-v-636d16e0=""
            class="list-item"
            v-for="(stat, index) in itemStore.ItemsSelection.stats"
            :key="index"
          >
            <div
              data-v-636d16e0=""
              class="health value column"
              style="
                background: color-mix(
                  in srgb,
                  var(--slate-2),
                  color-mix(in srgb, var(--red), var(--green) 50%) 0%
                );
              "
              v-if="stat && stat > 0"
            >
              {{ stat.toString().includes('.') ? stat.toFixed(2) : stat }}
              <span data-v-636d16e0="">&nbsp; </span>
            </div>
            <div
              data-v-636d16e0=""
              class="name"
              v-if="typeof index === 'string' && stat && stat > 0"
            >
              {{ getTrad(index) }}
            </div>
          </div>
          <div data-v-636d16e0="" class="list-item">
            <div
              data-v-636d16e0=""
              class="gold value column"
              style="
                background: color-mix(
                  in srgb,
                  var(--slate-2),
                  color-mix(in srgb, var(--green), var(--red) 50%) 0%
                );
              "
            >
              {{ itemStore.ItemsSelection.gold.total }}
              <span data-v-636d16e0="">&nbsp; </span>
            </div>
            <div data-v-636d16e0="" class="name">gold</div>
          </div>
        </div>
        <div data-v-636d16e0="" class="slot">
          <div data-v-5f37b7fd="" data-v-6a781413="" class="note">
            <div data-v-cbff5ddf="" data-v-5f37b7fd="" class="tooltip">
              <svg
                data-v-5f37b7fd=""
                data-v-cbff5ddf-s=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M12 9h.01"></path>
                <path d="M11 12h1v4h1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
