<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import version from '@/assets/files/lastVersion.json'
import ChampionTooltip from '@/components/ChampionTooltip.vue'
import SummonerTooltip from '@/components/SummonerTooltip.vue'
import RuneTooltip from '@/components/RuneTooltip.vue'
import ShardTooltip from '@/components/ShardTooltip.vue'

const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
</script>

<template>
  <div data-v-b6709614="" class="sheet champions">
    {{ console.log(itemStore.ItemsSelection.core) }}
    <div
      data-v-15310f80=""
      data-v-b6709614=""
      class="sheet"
      style="
        --971f605c: oklch(70% 0.1 230);
        --1180920d: linear-gradient(
          135deg,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            0%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            50%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            50%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(22% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            100%
        );
        --1c64872f: linear-gradient(
          135deg,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            0%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 0%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            6.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 6.25%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            12.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 12.5%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            18.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 18.75%
            )
            25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            31.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 31.25%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            37.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 37.5%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            43.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 43.75%
            )
            50%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            50%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 50%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            56.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 56.25%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            62.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 62.5%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            68.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 68.75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 75%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            81.25%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 81.25%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            87.5%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 87.5%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            93.75%,
          color-mix(
              in srgb,
              oklch(26% 0.05 240),
              color-mix(in srgb, var(--black), oklch(13% 0.05 240) 37%) 93.75%
            )
            100%
        );
      "
    >
      <div data-v-15310f80="" class="type">darkaine</div>
      <div data-v-15310f80="" class="version">{{ version }}</div>
      <div data-v-15310f80="" class="wrap">
        <div data-v-15310f80="" class="shadow"></div>
        <div
          data-v-15310f80=""
          :class="{
            champion: true,
            hide: !championStore.selectedChampion,
          }"
        >
          <div
            data-v-cbff5ddf=""
            data-v-5bc51be1=""
            data-v-1f02dc05=""
            data-v-15310f80=""
            class="tooltip"
          >
            <div
              data-v-1f02dc05=""
              data-v-cbff5ddf-s=""
              :class="{
                champion: true,
                hide: !championStore.selectedChampion,
              }"
            >
              <img
                data-v-1f02dc05=""
                data-v-cbff5ddf-s=""
                :src="
                  'https://ddragon.leagueoflegends.com/cdn/' +
                  version +
                  '/img/champion/' +
                  championStore.selectedChampion?.image.full
                "
              />
            </div>
            <div
              data-v-cbff5ddf=""
              class="box"
              style="position: absolute; left: 79px; top: 91px"
            >
              <ChampionTooltip :champion="championStore.selectedChampion" />
            </div>
          </div>
        </div>
        <div
          data-v-15310f80=""
          :class="{
            name: true,
            hide: !championStore.selectedChampion,
          }"
        >
          {{ championStore.selectedChampion?.name }}
        </div>
        <hr
          data-v-15310f80=""
          :class="{
            hide: !runeStore.runesSelection.principal,
          }"
        />
        <div
          data-v-15310f80=""
          :class="{
            runes: true,
            hide: !runeStore.runesSelection.principal,
          }"
        >
          <div
            data-v-cbff5ddf=""
            data-v-ab218c16=""
            data-v-15310f80=""
            class="tooltip"
          >
            <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
              <img
                v-if="runeStore.runesSelection.groups[1].principal"
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${runeStore.runesSelection.groups[1].principal?.icon}`"
              />
              <RuneTooltip
                :rune="runeStore.runesSelection.groups[1].principal"
              />
            </div>
          </div>
          <div data-v-15310f80="" class="main">
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  v-if="runeStore.runesSelection.groups[2].principal"
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runeStore.runesSelection.groups[2].principal?.icon}`"
                />
                <RuneTooltip
                  :rune="runeStore.runesSelection.groups[2].principal"
                />
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  v-if="runeStore.runesSelection.groups[3].principal"
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runeStore.runesSelection.groups[3].principal?.icon}`"
                />
                <RuneTooltip
                  :rune="runeStore.runesSelection.groups[3].principal"
                />
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune">
                <img
                  v-if="runeStore.runesSelection.groups[4].principal"
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runeStore.runesSelection.groups[4].principal?.icon}`"
                />
                <RuneTooltip
                  :rune="runeStore.runesSelection.groups[4].principal"
                />
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                class="rune path"
                v-if="runeStore.runesSelection.second"
              >
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runeStore.runesSelection.second?.icon}`"
                />
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
              v-for="(group, index) in runeStore.runesSelection.groups"
              :key="index"
            >
              <div
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                class="rune"
                v-if="group.second"
              >
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${group.second.icon}`"
                />
                <RuneTooltip :rune="group.second" />
              </div>
            </div>
          </div>
          <div data-v-15310f80="" class="shards">
            <div data-v-15310f80="" class="wrap">
              <div
                data-v-cbff5ddf=""
                data-v-ad54ad37=""
                data-v-15310f80=""
                class="tooltip"
                v-if="shardStore.shardsSelection.principal"
              >
                <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shardStore.shardsSelection.principal?.image}`"
                  />
                  <ShardTooltip :shard="shardStore.shardsSelection.principal" />
                </div>
              </div>
              <div
                data-v-cbff5ddf=""
                data-v-ad54ad37=""
                data-v-15310f80=""
                class="tooltip"
                v-if="shardStore.shardsSelection.second"
              >
                <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shardStore.shardsSelection.second?.image}`"
                  />
                  <ShardTooltip :shard="shardStore.shardsSelection.second" />
                </div>
              </div>
              <div
                data-v-cbff5ddf=""
                data-v-ad54ad37=""
                data-v-15310f80=""
                class="tooltip"
                v-if="shardStore.shardsSelection.third"
              >
                <div data-v-ad54ad37="" data-v-cbff5ddf-s="" class="shard">
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shardStore.shardsSelection.third?.image}`"
                  />
                  <ShardTooltip :shard="shardStore.shardsSelection.third" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr
          data-v-15310f80=""
          :class="{
            hide: !runeStore.runesSelection.principal,
          }"
        />
        <div data-v-15310f80="" class="itemsGroup">
          <div data-v-15310f80="" class="items">
            <div
              data-v-15310f80=""
              class="sheetItem"
              v-for="(item, index) in itemStore.ItemsSelection.core"
              :key="index"
            >
              <div
                data-v-354b7b55=""
                data-v-7ab6e59a=""
                data-v-15310f80=""
                class="tip"
              >
                <div data-v-cbff5ddf="" data-v-354b7b55="" class="tooltip">
                  <div
                    data-v-7ab6e59a=""
                    data-v-cbff5ddf-s=""
                    to="false"
                    class="item"
                    replace="false"
                  >
                    <img
                      data-v-7ab6e59a=""
                      data-v-cbff5ddf-s=""
                      class="img"
                      :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-v-15310f80=""
            :class="{
              sums: true,
              hide: !summonerStore.summonerSelection.principal,
            }"
          >
            <div
              data-v-cbff5ddf=""
              data-v-bab95e98=""
              data-v-15310f80=""
              class="tooltip"
              v-for="(summoner, index) in summonerStore.summonerSelection"
              :key="index"
            >
              <div data-v-bab95e98="" data-v-cbff5ddf-s="" class="summoner">
                <img
                  data-v-bab95e98=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/14.22.1/img/spell/${summoner?.image.full}`"
                />
                <SummonerTooltip :summoner="summoner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
