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
  <div data-v-6a49ead9="" data-v-c3d704f8="" class="runesPage">
    <div data-v-6a49ead9="" class="wrap">
      <div data-v-6a49ead9="" class="path">
        <div
          data-v-6a49ead9=""
          class="wrap"
          v-for="(rune, index) in runesData"
          :key="index"
          @click="selectedRune(index, 'principal')"
        >
          <div data-v-de17e6dc="" data-v-6a49ead9="" class="tooltip">
            <button
              data-v-6a49ead9=""
              data-v-de17e6dc-s=""
              :class="{
                rune: true,
                [rune.key]: true,
                'selected chosen row':
                  index === runesSelection.principal ||
                  runesSelection.principal === -1,
                row: !(
                  index === runesSelection.principal ||
                  runesSelection.principal === -1
                ),
              }"
            >
              <img
                data-v-6a49ead9=""
                data-v-de17e6dc-s=""
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
              />
            </button>
          </div>
        </div>
      </div>
      <div data-v-6a49ead9="" class="path">
        <div
          data-v-6a49ead9=""
          class="wrap"
          v-for="(rune, index) in runesData"
          :key="index"
          @click="selectedRune(index, 'second')"
        >
          <div data-v-de17e6dc="" data-v-6a49ead9="" class="tooltip">
            <button
              data-v-6a49ead9=""
              data-v-de17e6dc-s=""
              :class="{
                rune: true,
                [rune.key]: true,
                'selected chosen row':
                  index === runesSelection.second ||
                  runesSelection.second === -1,
                row: !(
                  index === runesSelection.second ||
                  runesSelection.second === -1
                ),
              }"
            >
              <img
                data-v-6a49ead9=""
                data-v-de17e6dc-s=""
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        data-v-cf683915=""
        data-v-6a49ead9=""
        class="runes"
        style="--47881b34: 66px"
      >
        <div
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[0]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'principal', 0)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-0 rune"
            style="grid-area: 1 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[0].principal ||
                    runesSelection.groups[0].principal === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 1 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[1]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'principal', 1)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-1 rune"
            style="grid-area: 2 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[1].principal ||
                    runesSelection.groups[1].principal === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 2 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[2]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'principal', 2)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-2 rune"
            style="grid-area: 3 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[2].principal ||
                    runesSelection.groups[2].principal === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 3 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.principal]?.slots[3]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'principal', 3)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-3 rune"
            style="grid-area: 4 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[3].principal ||
                    runesSelection.groups[3].principal === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
      </div>
      <div
        data-v-cf683915=""
        data-v-6a49ead9=""
        class="runes"
        style="--47881b34: 66px"
      >
        <div>
          <div
            data-v-cf683915=""
            class="slot-0-pos-0 rune"
            style="grid-area: 1 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                class="rune-item row selected"
              ></button>
            </div>
          </div>
        </div>
        <div>
          <div
            data-v-cf683915=""
            class="slot-0-pos-0 rune"
            style="grid-area: 1 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                class="rune-item row selected"
              ></button>
            </div>
          </div>
        </div>
        <div>
          <div
            data-v-cf683915=""
            class="slot-0-pos-0 rune"
            style="grid-area: 1 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                class="rune-item row selected"
              ></button>
            </div>
          </div>
        </div>

        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 1 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[1]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'second', 0)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-1 rune"
            style="grid-area: 2 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[0].second ||
                    runesSelection.groups[0].second === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 2 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[2]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'second', 1)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-2 rune"
            style="grid-area: 3 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[1].second ||
                    runesSelection.groups[1].second === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
        <div
          data-v-cf683915=""
          class="slot-0-pos-3 rune"
          style="grid-area: 3 / 4"
        >
          <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip"></div>
        </div>
        <div
          v-for="(rune, index) in runesData[runesSelection.second]?.slots[3]
            ?.runes"
          :key="index"
          @click="selectedRune(index, 'second', 2)"
        >
          <div
            data-v-cf683915=""
            class="slot-0-pos-3 rune"
            style="grid-area: 4 / 1"
          >
            <div data-v-de17e6dc="" data-v-cf683915="" class="tooltip">
              <button
                data-v-cf683915=""
                data-v-de17e6dc-s=""
                :class="{
                  'rune-item row ': true,
                  selected:
                    index === runesSelection.groups[2].second ||
                    runesSelection.groups[2].second === -1,
                }"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          </div>
        </div>
      </div>
      <div
        data-v-329ba674=""
        data-v-6a49ead9=""
        class="summoners"
        style="--72818571: 66px"
      >
        <div data-v-329ba674="" class="list">
          <div
            v-for="(summoner, index) in filteredSummonerData"
            :key="index"
            @click="selectedSummoner(index)"
          >
            <div data-v-329ba674="" class="summoner">
              <div data-v-de17e6dc="" data-v-329ba674="" class="tooltip">
                <button
                  data-v-329ba674=""
                  data-v-de17e6dc-s=""
                  :class="{
                    'item row ': true,
                    selected:
                      index === summonerSelection.principal ||
                      summonerSelection.second === index ||
                      (summonerSelection.principal === -1 &&
                        summonerSelection.second === -1),
                  }"
                >
                  <img
                    data-v-329ba674=""
                    data-v-de17e6dc-s=""
                    :src="`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/spell/${summoner.image.full}`"
                  />
                </button>
                <SummonerTooltip
                  :summoner="{
                    image: { full: summoner.image.full },
                    name: summoner.name,
                    description: summoner.description,
                    tooltip: summoner.tooltip,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-v-41863a3e=""
        data-v-6a49ead9=""
        class="shards"
        style="--ad52185c: 66px"
      >
        <div v-for="(shards, index) in shardsData" :key="index">
          <div
            data-v-41863a3e=""
            class="shard"
            v-for="(shard, index) in shards"
            :key="index"
            @click="selectedShard(index.toString(), shard.type)"
          >
            <div data-v-de17e6dc="" data-v-41863a3e="" class="tooltip">
              <button
                data-v-41863a3e=""
                data-v-de17e6dc-s=""
                :class="{
                  'item row ': true,
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
                <img
                  data-v-41863a3e=""
                  data-v-de17e6dc-s=""
                  :src="`/assets/icons/${shard.image}`"
                />
              </button>
              <ShardTooltip
                :shard="{
                  image: shard.image,
                  description: shard.description,
                }"
              />
            </div>
          </div>

          <div data-v-41863a3e="" class="space"></div>
        </div>
      </div>
    </div>
  </div>
  <div data-v-c3d704f8="" class="next off">
    <button data-v-c3d704f8="">Next</button>
  </div>
</template>
