<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import runes from '@/assets/files/runesReforged.json'
import summoner from '@/assets/files/summoner.json'
import shards from '@/assets/files/shards.json'
import RuneTooltip from '@/components/RuneTooltip.vue'
import SummonerTooltip from '@/components/SummonerTooltip.vue'
import ShardTooltip from '@/components/ShardTooltip.vue'

interface Rune {
  id: number
  key: string
  icon: string
  name: string
  slots: {
    runes: {
      id: number
      key: string
      icon: string
      name: string
      shortDesc: string
      longDesc: string
    }[]
  }[]
}

interface Shard {
  [key: string]: {
    type: 'principal' | 'second' | 'third'
    description: string
    image: string
  }
}

const runesData = ref<Rune[]>([])
const summonerData = ref<
  Array<(typeof summoner.data)[keyof typeof summoner.data]>
>([])
const shardsData = ref<Shard[]>([])
const filteredSummonerData = computed(() => {
  return summonerData.value.filter(summoner =>
    summoner.modes.includes('CLASSIC'),
  )
})

const runesSelection = ref({
  principal: -1,
  second: -1,
  groups: [
    { principal: -1, second: -1 },
    { principal: -1, second: -1 },
    { principal: -1, second: -1 },
    { principal: -1, second: -1 },
    { principal: -1, second: -1 },
  ],
})

const selectedRune = (
  index: number,
  type: 'principal' | 'second',
  groupIndex?: number,
) => {
  if (groupIndex !== undefined) {
    runesSelection.value.groups[groupIndex][type] = index
  } else {
    runesSelection.value[type] = index
  }
}

const summonerSelection = ref({
  principal: -1,
  second: -1,
})

const selectedSummoner = (index: number) => {
  if (summonerSelection.value.principal === index) {
    summonerSelection.value.principal = -1
  } else if (summonerSelection.value.second === index) {
    summonerSelection.value.second = -1
  } else if (summonerSelection.value.principal === -1) {
    summonerSelection.value.principal = index
  } else if (summonerSelection.value.second === -1) {
    summonerSelection.value.second = index
  } else {
    summonerSelection.value.second = summonerSelection.value.principal
    summonerSelection.value.principal = index
  }
}

const shardsSelection = ref({
  principal: '',
  second: '',
  third: '',
})

const selectedShard = (
  index: string,
  type: 'principal' | 'second' | 'third',
) => {
  shardsSelection.value[type] = index
}

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  shardsData.value = Object.values(shards.data) as Shard[]
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
          @click="selectedRune(index, 'principal')"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected row':
              index === runesSelection.principal ||
              runesSelection.principal === -1,
            row: !(
              index === runesSelection.principal ||
              runesSelection.principal === -1
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
          @click="selectedRune(index, 'second')"
          :class="{
            rune: true,
            [rune.key]: true,
            'selected ':
              (index === runesSelection.second ||
                runesSelection.second === -1) &&
              runesSelection.principal !== -1,
            row: true,
          }"
          :disabled="runesSelection.principal === -1"
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
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[0]
            ?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[0].principal ||
                runesSelection.groups[0].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 0)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-1 rune"
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[1]
            ?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[1].principal ||
                runesSelection.groups[1].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 1)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-2 rune"
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[2]
            ?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[2].principal ||
                runesSelection.groups[2].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 2)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-0-pos-3 rune"
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[3]
            ?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[3].principal ||
                runesSelection.groups[3].principal === -1,
            }"
            @click="selectedRune(index, 'principal', 3)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
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
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[0]
            ?.runes"
          :key="index"
          :style="`grid-area: 1 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[0].second ||
                runesSelection.groups[0].second === -1,
            }"
            @click="selectedRune(index, 'second', 0)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-1 rune"
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[1]
            ?.runes"
          :key="index"
          :style="`grid-area: 2 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[1].second ||
                runesSelection.groups[1].second === -1,
            }"
            @click="selectedRune(index, 'second', 1)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-2 rune"
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[2]
            ?.runes"
          :key="index"
          :style="`grid-area: 3 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[2].second ||
                runesSelection.groups[2].second === -1,
            }"
            @click="selectedRune(index, 'second', 2)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
        <div
          data-v-7b108f5e=""
          class="slot-1-pos-3 rune"
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[3]
            ?.runes"
          :key="index"
          :style="`grid-area: 4 / ${index + 1};`"
        >
          <button
            data-v-7b108f5e=""
            :class="{
              row: true,
              selected:
                index === runesSelection.groups[3].second ||
                runesSelection.groups[3].second === -1,
            }"
            @click="selectedRune(index, 'second', 3)"
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
              <RuneTooltip
                :rune="{
                  key: rune.key,
                  icon: rune.icon,
                  name: rune.name,
                  shortDesc: rune.shortDesc,
                  longDesc: rune.longDesc,
                }"
              />
            </div>
          </button>
        </div>
      </div>
      <div
        data-v-70a93f67=""
        data-v-c83b00c2=""
        class="summoners"
        style="--132d151c: 66px"
        v-if="runesSelection.second !== -1"
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
                  index === summonerSelection.principal ||
                  summonerSelection.second === index ||
                  (summonerSelection.principal === -1 &&
                    summonerSelection.second === -1),
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
                <SummonerTooltip
                  :summoner="{
                    image: { full: summoner.image.full },
                    name: summoner.name,
                    description: summoner.description,
                    tooltip: summoner.tooltip,
                  }"
                />
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
        v-if="runesSelection.second !== -1"
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
                  (index === shardsSelection.principal ||
                    shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardsSelection.second ||
                    shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardsSelection.third ||
                    shardsSelection.third === '')),
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
              <ShardTooltip
                :shard="{
                  image: shard.image,
                  description: shard.description,
                }"
              />
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
                  (index === shardsSelection.principal ||
                    shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardsSelection.second ||
                    shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardsSelection.third ||
                    shardsSelection.third === '')),
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
              <ShardTooltip
                :shard="{
                  image: shard.image,
                  description: shard.description,
                }"
              />
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
                  (index === shardsSelection.principal ||
                    shardsSelection.principal === '')) ||
                (shard.type === 'second' &&
                  (index === shardsSelection.second ||
                    shardsSelection.second === '')) ||
                (shard.type === 'third' &&
                  (index === shardsSelection.third ||
                    shardsSelection.third === '')),
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
              <ShardTooltip
                :shard="{
                  image: shard.image,
                  description: shard.description,
                }"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
