<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import runes from '@/assets/files/runesReforged.json'
import summoner from '@/assets/files/summoner.json'
import shards from '@/assets/files/shards.json'
import RuneTooltip from '@/components/RuneTooltip.vue'
import SummonerTooltip from '@/components/SummonerTooltip.vue'
import ShardTooltip from '@/components/ShardTooltip.vue'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'

import { type Rune, type SubRune, type Shard, type Summoner } from './type'

const runesData = ref<Rune[]>([])
const summonerData = ref<Summoner[]>([])
const shardsData = ref<Shard[]>([])

const runeStore = useRuneStore()
const shardStore = useShardStore()
const summonerStore = useSummonerStore()

const filteredSummonerData = computed(() => {
  return summonerData.value.filter(summoner =>
    summoner.modes.includes('CLASSIC'),
  )
})

const selectedRune = (
  index: number,
  type: 'principal' | 'second',
  groupIndex?: number,
  subRune?: SubRune,
  rune?: Rune,
) => {
  if (groupIndex !== undefined && subRune) {
    runeStore.setGroupRuneSelection(groupIndex, type, index)
  } else if (rune) {
    runeStore.setRuneSelection(type, index)
  }
}

const selectedSummoner = (index: number) => {
  if (summonerStore.summonerSelection.principal === index) {
    summonerStore.setSummonerSelection('principal', -1)
  } else if (summonerStore.summonerSelection.second === index) {
    summonerStore.setSummonerSelection('second', -1)
  } else if (summonerStore.summonerSelection.principal === -1) {
    summonerStore.setSummonerSelection('principal', index)
  } else if (summonerStore.summonerSelection.second === -1) {
    summonerStore.setSummonerSelection('second', index)
  } else {
    summonerStore.setSummonerSelection(
      'second',
      summonerStore.summonerSelection.principal,
    )
    summonerStore.setSummonerSelection('principal', index)
  }
}

const selectedShard = (
  index: string,
  type: 'principal' | 'second' | 'third',
) => {
  shardStore.setShardSelection(type, index)
}

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  shardsData.value = Object.values(shards.data) as Shard[]
})
</script>

<template>
  <div data-v-c83b00c2="" data-v-b6709614="" class="runesPage">
    {{ console.log(runeStore.runesSelection) }}
    <div data-v-c83b00c2="" class="wrap">
      <div data-v-c83b00c2="" class="path">
        <button
          data-v-c83b00c2=""
          v-for="(rune, index) in runesData"
          :key="index"
          @click="selectedRune(index, 'principal', undefined, undefined, rune)"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected row':
              index === runeStore.runesSelection.principal ||
              runeStore.runesSelection.principal === -1,
            row: !(
              index === runeStore.runesSelection.principal ||
              runeStore.runesSelection.principal === -1
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
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
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
          @click="selectedRune(index, 'second', undefined, undefined, rune)"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected ':
              (index === runeStore.runesSelection.second ||
                runeStore.runesSelection.second === -1) &&
              runeStore.runesSelection.principal !== -1,
            row: true,
          }"
          :disabled="runeStore.runesSelection.principal === -1"
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
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
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
          v-for="(rune, index) in runesData[runeStore.runesSelection.principal]
            ?.slots[0]?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[0].principal ||
                runeStore.runesSelection.groups[0].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 0, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-1 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.principal]
            ?.slots[1]?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[1].principal ||
                runeStore.runesSelection.groups[1].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 1, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-2 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.principal]
            ?.slots[2]?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[2].principal ||
                runeStore.runesSelection.groups[2].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 2, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-3 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.principal]
            ?.slots[3]?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[3].principal ||
                runeStore.runesSelection.groups[3].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 3, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
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
          v-for="(rune, index) in runesData[runeStore.runesSelection.second]
            ?.slots[0]?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[0].second ||
                runeStore.runesSelection.groups[0].second === -1,
            }"
            @click="selectedRune(index, 'second', 0, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-1 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.second]
            ?.slots[1]?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[1].second ||
                runeStore.runesSelection.groups[1].second === -1,
            }"
            @click="selectedRune(index, 'second', 1, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-2 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.second]
            ?.slots[2]?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[2].second ||
                runeStore.runesSelection.groups[2].second === -1,
            }"
            @click="selectedRune(index, 'second', 2, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-3 rune"
          v-for="(rune, index) in runesData[runeStore.runesSelection.second]
            ?.slots[3]?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runeStore.runesSelection.groups[3].second ||
                runeStore.runesSelection.groups[3].second === -1,
            }"
            @click="selectedRune(index, 'second', 3, rune)"
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
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </div>
              <RuneTooltip :rune="rune" />
            </div>
          </button>
        </div>
      </div>
      <div
        data-v-70a93f67=""
        data-v-c83b00c2=""
        class="summoners"
        style="--132d151c: 66px"
        v-if="runeStore.runesSelection.second !== -1"
      >
        <div data-v-70a93f67="" class="list">
          <div
            data-v-70a93f67=""
            class="sum"
            v-for="(summoner, index) in filteredSummonerData"
            :key="index"
            @click="selectedSummoner(index)"
          >
            <button
              data-v-70a93f67=""
              :class="{
                selected:
                  index === summonerStore.summonerSelection.principal ||
                  summonerStore.summonerSelection.second === index ||
                  (summonerStore.summonerSelection.principal === -1 &&
                    summonerStore.summonerSelection.second === -1),
              }"
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
                    :src="`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/spell/${summoner.image.full}`"
                  />
                </div>
                <SummonerTooltip :summoner="summoner" />
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
        v-if="runeStore.runesSelection.second !== -1"
      >
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData[0]"
          :key="index"
          @click="selectedShard(index.toString(), shard.type)"
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (index === shardStore.shardsSelection.principal ||
                    shardStore.shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardStore.shardsSelection.second ||
                    shardStore.shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardStore.shardsSelection.third ||
                    shardStore.shardsSelection.third === '')),
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
                  :src="`/assets/icons/${shard.image}`"
                />
              </div>
              <ShardTooltip :shard="shard" />
            </div>
          </button>
        </div>
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData[1]"
          :key="index"
          @click="selectedShard(index.toString(), shard.type)"
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (index === shardStore.shardsSelection.principal ||
                    shardStore.shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardStore.shardsSelection.second ||
                    shardStore.shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardStore.shardsSelection.third ||
                    shardStore.shardsSelection.third === '')),
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
                  :src="`/assets/icons/${shard.image}`"
                />
              </div>
              <ShardTooltip :shard="shard" />
            </div>
          </button>
        </div>
        <div
          data-v-5f2eb625=""
          class="shard"
          v-for="(shard, index) in shardsData[2]"
          :key="index"
          @click="selectedShard(index.toString(), shard.type)"
        >
          <button
            data-v-5f2eb625=""
            :class="{
              'row ': true,
              selected:
                (shard.type === 'principal' &&
                  (index === shardStore.shardsSelection.principal ||
                    shardStore.shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardStore.shardsSelection.second ||
                    shardStore.shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardStore.shardsSelection.third ||
                    shardStore.shardsSelection.third === '')),
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
                  :src="`/assets/icons/${shard.image}`"
                />
              </div>
              <ShardTooltip :shard="shard" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
