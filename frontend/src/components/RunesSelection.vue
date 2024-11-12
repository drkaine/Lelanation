<script setup lang="ts">
import { ref, onMounted } from 'vue'
import runes from '@/assets/files/runesReforged.json'
import summoner from '@/assets/files/summoner.json'
import shards from '@/assets/files/shards.json'

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
    description: string
    image: string
  }
}

const runesData = ref<Rune[]>([])
const summonerData = ref<
  Array<(typeof summoner.data)[keyof typeof summoner.data]>
>([])
const shardsData = ref<Shard[]>([])

onMounted(() => {
  runesData.value = Object.values(runes)
  summonerData.value = Object.values(summoner.data)
  shardsData.value = Object.values(shards.data)
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
        >
          <div data-v-de17e6dc="" data-v-6a49ead9="" class="tooltip">
            <button
              data-v-6a49ead9=""
              data-v-de17e6dc-s=""
              :class="rune.key + ' rune path'"
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
        >
          <div data-v-de17e6dc="" data-v-6a49ead9="" class="tooltip">
            <button
              data-v-6a49ead9=""
              data-v-de17e6dc-s=""
              :class="rune.key + ' rune path'"
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
          v-for="(rune, index) in runesData[0]?.slots[0]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[1]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[2]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[3]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[1]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[2]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          v-for="(rune, index) in runesData[0]?.slots[3]?.runes"
          :key="index"
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
                class="rune-item row selected"
              >
                <img
                  data-v-cf683915=""
                  data-v-de17e6dc-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`"
                />
              </button>
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
          <section v-for="(summoner, index) in summonerData" :key="index">
            <div
              data-v-329ba674=""
              class="summoner"
              v-if="summoner.modes.includes('CLASSIC')"
            >
              <div data-v-de17e6dc="" data-v-329ba674="" class="tooltip">
                <button
                  data-v-329ba674=""
                  data-v-de17e6dc-s=""
                  class="item row selected"
                >
                  <img
                    data-v-329ba674=""
                    data-v-de17e6dc-s=""
                    :src="`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/spell/${summoner.image.full}`"
                  />
                </button>
              </div>
            </div>
            <div data-v-329ba674="" class="space"></div>
          </section>
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
          >
            <div data-v-de17e6dc="" data-v-41863a3e="" class="tooltip">
              <button
                data-v-41863a3e=""
                data-v-de17e6dc-s=""
                class="item row selected"
              >
                <img
                  data-v-41863a3e=""
                  data-v-de17e6dc-s=""
                  :src="`/src/assets/icons/${shard.image}`"
                />
              </button>
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
