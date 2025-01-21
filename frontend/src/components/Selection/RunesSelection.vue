<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import runes from '@/assets/files/data/runesReforged.json'
import summoner from '@/assets/files/data/summoner.json'
import shards from '@/assets/files/data/shards.json'
// import SummonerTooltip from '@/components/Tooltip/SummonerTooltip.vue'
// import ShardTooltip from '@/components/Tooltip/ShardTooltip.vue'
import { useRuneStore } from '@/stores/runeStore'
import { useShardStore } from '@/stores/shardStore'
// import { useSummonerStore } from '@/stores/summonerStore'
// import { TooltipCoordonne } from '../script/TooltipCoordonne'

import type { Rune, SubRune } from '@/types/rune'
import type { Shard, ShardColumn } from '@/types/shard'
import type { Summoner } from '@/types/summoner'

const runesData = ref<Rune[]>(runes)
const summonerData = ref<Summoner[]>([])
const shardsData = ref<ShardColumn>()

const runeStore = useRuneStore()
const shardStore = useShardStore()
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

const selectAndClose = (
  type: 'principal' | 'second',
  slotIndex?: number,
  subRune?: SubRune,
  rune?: Rune,
) => {
  if (slotIndex !== undefined) {
    selectedRune(type, slotIndex, subRune)
    showPrimarySlotSelector.value[slotIndex] = false
  } else {
    selectedRune(type, undefined, undefined, rune)
    showPrimarySelector.value = false
  }
  hideTooltip()
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

const selectedShard = (
  shard: Shard | null,
  type: 'principal' | 'second' | 'third',
) => {
  shardStore.setShardSelection(type, shard)
}

const getSelectedShard = (index: number) => {
  if (index === 0) return runeStore.runesSelection.principal
  return runeStore.runesSelection.groups[index]?.principal || null
}

const getSelectedRune = (index: number | null) => {
  if (index === 0 || index === null) return runeStore.runesSelection.principal
  return runeStore.runesSelection.groups[index]?.principal || null
}

const getSelectedSecondaryRune = (index: number | null) => {
  if (index === 0 || index === null) return runeStore.runesSelection.second
  return runeStore.runesSelection.groups[index]?.second || null
}

const showPrimarySelector = ref(false)
const showSecondarySelector = ref(false)

const showPrimarySlotSelector = ref([false, false, false, false, false])

const showSecondarySlotSelector = ref([false, false, false])

interface TooltipRune {
  id: number
  name: string
  shortDesc: string
}

const activeTooltip = ref<TooltipRune | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const showTooltip = (rune: SubRune, event: MouseEvent) => {
  activeTooltip.value = {
    id: rune.id,
    name: rune.name,
    shortDesc: rune.shortDesc,
  }
  tooltipX.value = event.clientX + 15
  tooltipY.value = event.clientY + 15
}

const hideTooltip = () => {
  activeTooltip.value = null
}

const showShardSelector = ref(false)
const activeShardIndex = ref(1)

const toggleShardSelector = (index: number) => {
  activeShardIndex.value = index
  showShardSelector.value = !showShardSelector.value
}

const selectShardAndClose = (shard: Shard) => {
  selectedShard(
    shard,
    `stat${activeShardIndex.value}` as 'principal' | 'second' | 'third',
  )
  showShardSelector.value = false
}

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  shardsData.value = shards.data
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
              @click="selectAndClose('principal', undefined, undefined, rune)"
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
          <div
            class="rune-slot"
            @click="
              showPrimarySlotSelector[index] = !showPrimarySlotSelector[index]
            "
            :class="{ selected: getSelectedRune(index) }"
          >
            <img
              v-if="getSelectedRune(index)"
              :src="`/assets/icons/runes/${getSelectedRune(index)?.id}.png`"
            />
          </div>

          <div
            v-if="
              showPrimarySlotSelector[index] &&
              runeStore.runesSelection.principal
            "
            class="runes-selector"
          >
            <button
              v-for="subrune in runeStore.runesSelection.principal.slots[
                index - 1
              ]?.runes"
              :key="subrune.id"
              @click="selectAndClose('principal', index, subrune)"
              @mouseover="showTooltip(subrune, $event)"
              @mouseleave="hideTooltip"
              :class="{
                'rune-option': true,
                selected:
                  subrune.id ===
                  runeStore.runesSelection.groups[index]?.principal?.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${subrune.id}.png`"
                :alt="subrune.name"
              />
            </button>
          </div>

          <div class="rune-description">
            {{ getSelectedRune(index)?.name || 'Sélectionnez une rune' }}
          </div>
        </div>
      </div>

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
              @click="selectAndClose('second', undefined, undefined, rune)"
              :class="{
                'rune-option': true,
                selected: rune.id === runeStore.runesSelection.second?.id,
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
          <div
            class="rune-slot"
            @click="
              showSecondarySlotSelector[index] =
                !showSecondarySlotSelector[index]
            "
            :class="{ selected: getSelectedSecondaryRune(index) }"
          >
            <img
              v-if="getSelectedSecondaryRune(index)"
              :src="`/assets/icons/runes/${getSelectedSecondaryRune(index)?.id}.png`"
            />
          </div>

          <div
            v-if="
              showSecondarySlotSelector[index] &&
              runeStore.runesSelection.second
            "
            class="runes-selector secondary-selector"
          >
            <div
              v-for="(
                slot, slotIndex
              ) in runeStore.runesSelection.second.slots.slice(1, 4)"
              :key="`slot-${slotIndex}`"
              class="rune-slot-group"
            >
              <div class="rune-slot-line" v-if="slotIndex > 0"></div>
              <div class="rune-options-container">
                <button
                  v-for="rune in slot.runes"
                  :key="rune.id"
                  @click="selectAndClose('second', index, rune)"
                  @mouseover="showTooltip(rune, $event)"
                  @mouseleave="hideTooltip"
                  :class="{
                    'rune-option': true,
                    selected:
                      rune.id ===
                      runeStore.runesSelection.groups[index]?.second?.id,
                  }"
                >
                  <img
                    :src="`/assets/icons/runes/${rune.id}.png`"
                    :alt="rune.name"
                  />
                </button>
              </div>
            </div>
          </div>

          <div class="rune-description">
            {{
              getSelectedSecondaryRune(index)?.name || 'Sélectionnez une rune'
            }}
          </div>
        </div>

        <div class="stat-shards">
          <div v-for="index in 3" :key="'shard-' + index" class="rune-tier">
            <div
              class="rune-slot"
              @click="toggleShardSelector(index)"
              :class="{ selected: getSelectedShard(index) }"
            >
              <img
                v-if="getSelectedShard(index)"
                :src="`/assets/icons/shards/${getSelectedShard(index)?.id}.png`"
              />
            </div>
            <div class="rune-description">Sélectionnez une stat</div>
          </div>

          <div
            v-if="showShardSelector && shardsData"
            class="runes-selector secondary-selector"
          >
            <div class="rune-options-container">
              <button
                v-for="shard in shardsData[activeShardIndex - 1]"
                :key="shard.image"
                @click="selectShardAndClose(shard)"
              >
                <img
                  :src="`/assets/icons/shards/${shard.image}`"
                  :alt="shard.description"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="activeTooltip"
      class="rune-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <h3>{{ activeTooltip.name }}</h3>
      <p>{{ activeTooltip.shortDesc }}</p>
    </div>
  </div>
</template>
