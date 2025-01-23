<script setup lang="ts">
import { useItemStore } from '@/stores/itemStore'
// import statsTrad from '../../../public/assets/files/statsTrad.json'

const itemStore = useItemStore()
// const getTrad = (name: string) => {
//   return statsTrad[name as keyof typeof statsTrad]
// }

const removeItem = (index: number) => {
  itemStore.removeItem(index)
}
</script>

<template>
  <div class="extra" id="extra">
    <div class="picks">
      <div class="list">
        <div
          class="pick-item"
          v-for="(item, index) in itemStore.ItemsSelection.core"
          :key="index"
        >
          <div class="tip">
            <button
              to="false"
              class="item"
              replace="false"
              @click="removeItem(index)"
            >
              <img
                class="img"
                :src="`/assets/icons/items/${item.image.full}`"
                :alt="item.name"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="extra-stats">
      <div class="stats">
        <div class="list">
          <div class="labels">
            <div class="label column">total</div>
          </div>
          <div
            class="list-item"
            v-for="(stat, index) in itemStore.ItemsSelection.stats"
            :key="index"
          >
            <div
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
              <span>&nbsp; </span>
            </div>
            <div
              class="name"
              v-if="typeof index === 'string' && stat && stat > 0"
            >
              <!-- {{ getTrad(index) }} -->
            </div>
          </div>
          <div class="list-item">
            <div
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
              <span>&nbsp; </span>
            </div>
            <div class="name">gold</div>
          </div>
        </div>
        <div class="slot">
          <div class="note">
            <div class="tooltip">
              <svg
                s
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
