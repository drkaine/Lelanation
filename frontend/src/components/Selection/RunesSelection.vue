<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import runes from '@/assets/files/data/runesReforged.json'
import summoner from '@/assets/files/data/summoner.json'
// import shards from '@/assets/files/data/shards.json'
// import RuneTooltip from '@/components/Tooltip/RuneTooltip.vue'
// import SummonerTooltip from '@/components/Tooltip/SummonerTooltip.vue'
// import ShardTooltip from '@/components/Tooltip/ShardTooltip.vue'
import { useRuneStore } from '@/stores/runeStore'
// import { useShardStore } from '@/stores/shardStore'
// import { useSummonerStore } from '@/stores/summonerStore'
// import { TooltipCoordonne } from '../script/TooltipCoordonne'

import type { Rune, SubRune } from '@/types/rune'
// import type { Shard, ShardColumn } from '@/types/shard'
import type { Summoner } from '@/types/summoner'

const runesData = ref<Rune[]>(runes)
const summonerData = ref<Summoner[]>([])
// const shardsData = ref<ShardColumn>()

const runeStore = useRuneStore()
// const shardStore = useShardStore()
// const summonerStore = useSummonerStore()

// const tooltip = new TooltipCoordonne()

// const tooltipLeft = tooltip.tooltipLeft
// const tooltipTop = tooltip.tooltipTop

// const updateMousePosition = (event: MouseEvent) => {
//   tooltip.updateMousePosition(event)
// }

// const resetMousePosition = () => {
//   tooltip.resetMousePosition()
// }

// const filteredSummonerData = computed(() => {
//   return summonerData.value.filter(summoner =>
//     summoner.modes.includes('CLASSIC'),
//   )
// })

const filteredSecondaryRunes = computed(() =>
  runesData.value.filter(
    rune => rune.id !== runeStore.runesSelection.principal?.id,
  ),
)

const selectedRune = (
  type: 'principal' | 'second',
  groupIndex?: number,
  subRune?: SubRune,
  rune?: Rune,
) => {
  if (groupIndex && subRune) {
    runeStore.setGroupRuneSelection(groupIndex, type, subRune)
  } else if (rune) {
    runeStore.setRuneSelection(type, rune)
  }
}

// const selectedSummoner = (summoner: Summoner | null) => {
//   if (summonerStore.summonerSelection.principal === summoner) {
//     summonerStore.setSummonerSelection('principal', summoner)
//   } else if (summonerStore.summonerSelection.second === summoner) {
//     summonerStore.setSummonerSelection('second', summoner)
//   } else if (summonerStore.summonerSelection.principal === summoner) {
//     summonerStore.setSummonerSelection('principal', summoner)
//   } else if (summonerStore.summonerSelection.second === summoner) {
//     summonerStore.setSummonerSelection('second', summoner)
//   } else {
//     summonerStore.setSummonerSelection(
//       'second',
//       summonerStore.summonerSelection.principal,
//     )
//     summonerStore.setSummonerSelection('principal', summoner)
//   }
// }

// const selectedShard = (
//   shard: Shard | null,
//   type: 'principal' | 'second' | 'third',
// ) => {
//   shardStore.setShardSelection(type, shard)
// }

const getSelectedShard = (index: number) => {
  if (index === 0) return runeStore.runesSelection.principal
  return runeStore.runesSelection.groups[index]?.principal || null
}

const getSelectedRune = (index: number | null) => {
  if (index === 0 || index === null) return runeStore.runesSelection.principal
  return runeStore.runesSelection.groups[index]?.principal || null
}

const showPrimarySelector = ref(false)
const showSecondarySelector = ref(false)

const selectAndClose = (type: 'principal' | 'second', rune: Rune) => {
  selectedRune(type, undefined, undefined, rune)
  if (type === 'principal') {
    showPrimarySelector.value = false
  } else {
    showSecondarySelector.value = false
  }
}

// const showSecondarySlotSelector = ref([false, false, false])

// const selectSecondaryAndClose = (slotIndex: number, rune: any) => {
//   selectedRune('second', slotIndex, rune)
//   showSecondarySlotSelector.value[slotIndex] = false
// }

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  // shardsData.value = shards.data
})
</script>

<template>
  <div class="runesPage">
    <div class="wrap">
      <div class="runes-primary">
        <div class="column-header">
          <button
            class="header-icon"
            @click="showPrimarySelector = !showPrimarySelector"
          >
            <img
              v-if="runeStore.runesSelection.principal"
              :src="`/assets/icons/runes/${runeStore.runesSelection.principal.id}.png`"
            />
          </button>

          <div v-if="showPrimarySelector" class="runes-selector">
            <button
              v-for="(rune, index) in runesData"
              :key="index"
              @click="selectAndClose('principal', rune)"
              :class="{
                'rune-option': true,
                selected: rune.id === runeStore.runesSelection.principal?.id,
                disabled: runeStore.runesSelection.second?.id === rune.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </button>
          </div>

          <div class="header-text">
            <div class="header-title">RUNES FONDAMENTALES</div>
            <div class="header-subtitle">
              {{
                runeStore.runesSelection.principal?.name ||
                'Sélectionnez une rune fondamentale'
              }}
            </div>
          </div>
        </div>

        <div
          v-for="index in 4"
          :key="index"
          class="rune-tier"
          :class="{ 'main-rune': index === 0 }"
        >
          <div class="rune-slot" :class="{ selected: getSelectedRune(index) }">
            <img
              v-if="getSelectedRune(index)"
              :src="`/assets/icons/runes/${getSelectedRune(index)?.id}.png`"
            />
          </div>
          <div class="rune-description">
            {{ getSelectedRune(index)?.name || 'Sélectionnez une rune' }}
          </div>
        </div>
      </div>

      <!-- Colonne secondaire -->
      <div class="runes-secondary">
        <div class="column-header">
          <button
            class="header-icon"
            @click="showSecondarySelector = !showSecondarySelector"
          >
            <img
              v-if="runeStore.runesSelection.second"
              :src="`/assets/icons/runes/${runeStore.runesSelection.second.id}.png`"
            />
          </button>

          <div v-if="showSecondarySelector" class="runes-selector">
            <button
              v-for="(rune, index) in filteredSecondaryRunes"
              :key="index"
              @click="selectAndClose('second', rune)"
              :class="{
                'rune-option': true,
                selected: rune.id === runeStore.runesSelection.second?.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </button>
          </div>

          <div class="header-text">
            <div class="header-title">BRANCHE SECONDAIRE</div>
            <div class="header-subtitle">
              {{
                runeStore.runesSelection.second?.name ||
                'Sélectionnez une branche secondaire'
              }}
            </div>
          </div>
        </div>

        <div v-for="index in 2" :key="index" class="rune-tier">
          <div class="rune-slot" :class="{ selected: getSelectedRune(index) }">
            <img
              v-if="getSelectedRune(index)"
              :src="`/assets/icons/runes/${getSelectedRune(index)?.id}.png`"
            />
          </div>
          <div class="rune-description">SECONDAIRE</div>
        </div>

        <div class="stat-shards">
          <div v-for="index in 3" :key="'shard-' + index" class="rune-tier">
            <div
              class="rune-slot"
              :class="{ selected: getSelectedShard(index) }"
            >
              <img
                v-if="getSelectedShard(index)"
                :src="`/assets/icons/shards/${getSelectedShard(index)?.id}.png`"
              />
            </div>
            <div class="rune-description">Sélectionnez une stat</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
