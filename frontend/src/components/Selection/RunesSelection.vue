<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import runes from '@/assets/files/runesReforged.json'
import summoner from '@/assets/files/summoner.json'
import shards from '@/assets/files/shards.json'
import RuneTooltip from '@/components/Tooltip/RuneTooltip.vue'
import SummonerTooltip from '@/components/Tooltip/SummonerTooltip.vue'
import ShardTooltip from '@/components/Tooltip/ShardTooltip.vue'
import { useRuneStore } from '@/stores/runeStore'
import { useShardStore } from '@/stores/shardStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { TooltipCoordonne } from '../script/TooltipCoordonne'

import type { Rune, SubRune } from '@/types/rune'
import type { Shard, ShardColumn } from '@/types/shard'
import type { Summoner } from '@/types/summoner'

const runesData = ref<Rune[]>(runes)
const summonerData = ref<Summoner[]>([])
const shardsData = ref<ShardColumn>()

const runeStore = useRuneStore()
const shardStore = useShardStore()
const summonerStore = useSummonerStore()

const tooltip = new TooltipCoordonne()

const tooltipLeft = tooltip.tooltipLeft
const tooltipTop = tooltip.tooltipTop

const updateMousePosition = (event: MouseEvent) => {
  tooltip.updateMousePosition(event)
}

const resetMousePosition = () => {
  tooltip.resetMousePosition()
}

const filteredSummonerData = computed(() => {
  return summonerData.value.filter(summoner =>
    summoner.modes.includes('CLASSIC'),
  )
})

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

const selectedSummoner = (summoner: Summoner | null) => {
  if (summonerStore.summonerSelection.principal === summoner) {
    summonerStore.setSummonerSelection('principal', summoner)
  } else if (summonerStore.summonerSelection.second === summoner) {
    summonerStore.setSummonerSelection('second', summoner)
  } else if (summonerStore.summonerSelection.principal === summoner) {
    summonerStore.setSummonerSelection('principal', summoner)
  } else if (summonerStore.summonerSelection.second === summoner) {
    summonerStore.setSummonerSelection('second', summoner)
  } else {
    summonerStore.setSummonerSelection(
      'second',
      summonerStore.summonerSelection.principal,
    )
    summonerStore.setSummonerSelection('principal', summoner)
  }
}

const selectedShard = (
  shard: Shard | null,
  type: 'principal' | 'second' | 'third',
) => {
  shardStore.setShardSelection(type, shard)
}

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  shardsData.value = shards.data
})
</script>

<template>
  <div data-v-c83b00c2="" data-v-b6709614="" class="runesPage">
    <div data-v-c83b00c2="" class="wrap">
      <div data-v-c83b00c2="" class="path">
        <button
          data-v-c83b00c2=""
          v-for="(rune, index) in runesData"
          :key="index"
          @click="selectedRune('principal', undefined, undefined, rune)"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected row':
              rune.id === runeStore.runesSelection.principal?.id ||
              runeStore.runesSelection.principal === null,
            row: !(
              rune.id === runeStore.runesSelection.principal?.id ||
              runeStore.runesSelection.principal === null
            ),
          }"
        >
          <div
            data-v-cbff5ddf=""
            data-v-ab218c16=""
            data-v-c83b00c2=""
            class="tooltip"
          >
            <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune path">
              <img
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </div>
          </div>
        </button>
      </div>
      <div data-v-c83b00c2="" class="path">
        <button
          data-v-c83b00c2=""
          v-for="(rune, index) in runesData"
          :key="index"
          @click="selectedRune('second', undefined, undefined, rune)"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected ':
              (rune.id === runeStore.runesSelection.second?.id ||
                !runeStore.runesSelection.second) &&
              runeStore.runesSelection.principal &&
              runeStore.runesSelection.principal !== rune,
            row: true,
          }"
          :disabled="
            runeStore.runesSelection.principal === null ||
            runeStore.runesSelection.principal === rune
          "
        >
          <div
            data-v-cbff5ddf=""
            data-v-ab218c16=""
            data-v-c83b00c2=""
            class="tooltip"
          >
            <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune path">
              <img
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </div>
          </div>
        </button>
      </div>
      <div
        data-v-7b108f5e=""
        data-v-c83b00c2=""
        class="runes"
        style="--2be422df: 66px"
      >
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-0 rune"
          v-for="(rune, index) in runeStore.runesSelection.principal?.slots[0]
            ?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[1].principal?.id ||
                !runeStore.runesSelection.groups[1].principal,
            }"
            @click="selectedRune('principal', 1, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-1 rune"
          v-for="(rune, index) in runeStore.runesSelection.principal?.slots[1]
            ?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[2].principal?.id ||
                !runeStore.runesSelection.groups[2].principal,
            }"
            @click="selectedRune('principal', 2, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-2 rune"
          v-for="(rune, index) in runeStore.runesSelection.principal?.slots[2]
            ?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[3].principal?.id ||
                !runeStore.runesSelection.groups[3].principal,
            }"
            @click="selectedRune('principal', 3, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-3 rune"
          v-for="(rune, index) in runeStore.runesSelection.principal?.slots[3]
            ?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[4].principal?.id ||
                !runeStore.runesSelection.groups[4].principal,
            }"
            @click="selectedRune('principal', 4, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        data-v-7b108f5e=""
        data-v-c83b00c2=""
        class="runes"
        style="--2be422df: 66px"
      >
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-0 rune"
          v-for="(rune, index) in runeStore.runesSelection.second?.slots[0]
            ?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[1].second?.id ||
                !runeStore.runesSelection.groups[1].second,
            }"
            @click="selectedRune('second', 1, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-1 rune"
          v-for="(rune, index) in runeStore.runesSelection.second?.slots[1]
            ?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[2].second?.id ||
                !runeStore.runesSelection.groups[2].second,
            }"
            @click="selectedRune('second', 2, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-2 rune"
          v-for="(rune, index) in runeStore.runesSelection.second?.slots[2]
            ?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[3].second?.id ||
                !runeStore.runesSelection.groups[3].second,
            }"
            @click="selectedRune('second', 3, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-3 rune"
          v-for="(rune, index) in runeStore.runesSelection.second?.slots[3]
            ?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                rune.id === runeStore.runesSelection.groups[4].second?.id ||
                !runeStore.runesSelection.groups[4].second,
            }"
            @click="selectedRune('second', 4, rune)"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-7b108f5e=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/runes/${rune.id}.png`"
                  :alt="rune.name"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip :rune="rune" />
              </div>
            </div>
          </button>
        </div>
      </div>
      <div
        data-v-70a93f67=""
        data-v-c83b00c2=""
        class="summoners"
        style="--132d151c: 66px"
        v-if="runeStore.runesSelection.second"
      >
        <div data-v-70a93f67="" class="list">
          <div
            data-v-70a93f67=""
            class="sum"
            v-for="(summoner, index) in filteredSummonerData"
            :key="index"
            @click="selectedSummoner(summoner)"
          >
            <button
              data-v-70a93f67=""
              :class="{
                selected:
                  summoner.id ===
                    summonerStore.summonerSelection.principal?.id ||
                  summonerStore.summonerSelection.second?.id === summoner.id ||
                  (!summonerStore.summonerSelection.principal &&
                    !summonerStore.summonerSelection.second),
              }"
              @mouseenter="updateMousePosition"
              @mouseleave="resetMousePosition"
            >
              <div
                data-v-cbff5ddf=""
                data-v-bab95e98=""
                data-v-70a93f67=""
                class="tooltip"
              >
                <div data-v-bab95e98="" data-v-cbff5ddf-s="" class="summoner">
                  <img
                    data-v-bab95e98=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/summoners/${summoner.image.full}`"
                    :alt="summoner.name"
                  />
                </div>
                <div
                  data-v-cbff5ddf=""
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                >
                  <SummonerTooltip :summoner="summoner" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div
        data-v-5f2eb625=""
        data-v-c83b00c2=""
        class="shards"
        style="--2e8b5dd2: 66px"
        v-if="runeStore.runesSelection.second"
      >
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData ? shardsData[0] : []"
          :key="index"
          @click="
            selectedShard(shard, shard.type as 'principal' | 'second' | 'third')
          "
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (shard === shardStore.shardsSelection.principal ||
                    !shardStore.shardsSelection.principal)) ||
                (shard.type === 'second' &&
                  (shard === shardStore.shardsSelection.second ||
                    !shardStore.shardsSelection.second)) ||
                (shard.type === 'third' &&
                  (shard === shardStore.shardsSelection.third ||
                    !shardStore.shardsSelection.third)),
            }"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ad54ad37=""
              data-v-5f2eb625=""
              class="tooltip"
            >
              <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                <img
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/shards/${shard.image}`"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <ShardTooltip :shard="shard" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData ? shardsData[1] : []"
          :key="index"
          @click="
            selectedShard(shard, shard.type as 'principal' | 'second' | 'third')
          "
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (shard === shardStore.shardsSelection.principal ||
                    !shardStore.shardsSelection.principal)) ||
                (shard.type === 'second' &&
                  (shard === shardStore.shardsSelection.second ||
                    !shardStore.shardsSelection.second)) ||
                (shard.type === 'third' &&
                  (shard === shardStore.shardsSelection.third ||
                    !shardStore.shardsSelection.third)),
            }"
            @mouseenter="updateMousePosition"
            @mouseleave="resetMousePosition"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ad54ad37=""
              data-v-5f2eb625=""
              class="tooltip"
            >
              <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                <img
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/shards/${shard.image}`"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <ShardTooltip :shard="shard" />
              </div>
            </div>
          </button>
        </div>
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData ? shardsData[2] : []"
          :key="index"
          @click="
            selectedShard(shard, shard.type as 'principal' | 'second' | 'third')
          "
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (shard === shardStore.shardsSelection.principal ||
                    !shardStore.shardsSelection.principal)) ||
                (shard.type === 'second' &&
                  (shard === shardStore.shardsSelection.second ||
                    !shardStore.shardsSelection.second)) ||
                (shard.type === 'third' &&
                  (shard === shardStore.shardsSelection.third ||
                    !shardStore.shardsSelection.third)),
            }"
          >
            <div
              data-v-cbff5ddf=""
              data-v-ad54ad37=""
              data-v-5f2eb625=""
              class="tooltip"
            >
              <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                <img
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  :src="`/assets/icons/shards/${shard.image}`"
                />
              </div>
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <ShardTooltip :shard="shard" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
