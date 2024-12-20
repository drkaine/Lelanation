<script setup lang="ts">
import ChampionTooltip from '@/components/Tooltip/ChampionTooltip.vue'
import SummonerTooltip from '@/components/Tooltip/SummonerTooltip.vue'
import RuneTooltip from '@/components/Tooltip/RuneTooltip.vue'
import ShardTooltip from '@/components/Tooltip/ShardTooltip.vue'
import ItemTooltip from '@/components/Tooltip/ItemTooltip.vue'
import {
  type SummonerSelection,
  type ShardSelection,
  type Champion,
  type RunesSelection,
  type ItemSelection,
  type Item,
} from '../script/type'
import itemsFiles from '@/assets/files/item.json'
import { TooltipCoordonne } from '../script/TooltipCoordonne'

const props = defineProps<{
  version: string | null
  name: string | null
  description: string | null
  champion: Champion | null
  runes: RunesSelection | null
  summonners: SummonerSelection | null
  shards: ShardSelection | null
  items: ItemSelection | null
}>()

const tooltip = new TooltipCoordonne()

const tooltipLeft = tooltip.tooltipLeft
const tooltipTop = tooltip.tooltipTop

const updateMousePosition = (event: MouseEvent) => {
  tooltip.updateMousePosition(event)
}

const resetMousePosition = () => {
  tooltip.resetMousePosition()
}

const getItemsFrom = (item: Item) => {
  return (
    item.from
      ?.map((id: string) => itemsFiles.data[id as keyof typeof itemsFiles.data])
      .filter(Boolean) || []
  )
}

const getItemsInto = (item: Item) => {
  return (
    item.into
      ?.map((id: string) => itemsFiles.data[id as keyof typeof itemsFiles.data])
      .filter(Boolean) || []
  )
}
</script>

<template>
  {{ console.log('ici') }}{{ console.log(props) }}
  <div data-v-b6709614="" class="sheet champions">
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
      <div data-v-15310f80="" class="version">{{ props.version }}</div>
      <div data-v-15310f80="" class="wrap">
        <div data-v-15310f80="" class="shadow"></div>
        <div
          data-v-15310f80=""
          :class="{
            champion: true,
            hide: !champion,
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
                hide: !champion,
              }"
              @mouseenter="updateMousePosition"
              @mouseleave="resetMousePosition"
            >
              <img
                data-v-1f02dc05=""
                data-v-cbff5ddf-s=""
                :src="
                  'https://ddragon.leagueoflegends.com/cdn/' +
                  version +
                  '/img/champion/' +
                  champion?.image.full
                "
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
              <ChampionTooltip :champion="champion" />
            </div>
          </div>
        </div>
        <div
          data-v-15310f80=""
          :class="{
            name: true,
            hide: !champion,
          }"
        >
          {{ champion?.name }}
        </div>
        <hr
          data-v-15310f80=""
          :class="{
            hide: !runes?.principal,
          }"
        />
        <div
          data-v-15310f80=""
          :class="{
            runes: true,
            hide: !runes?.principal,
          }"
        >
          <div
            data-v-cbff5ddf=""
            data-v-ab218c16=""
            data-v-15310f80=""
            class="tooltip"
          >
            <div
              data-v-ab218c16=""
              data-v-cbff5ddf-s=""
              class="rune"
              @mouseenter="updateMousePosition"
              @mouseleave="resetMousePosition"
            >
              <img
                v-if="runes?.groups[1].principal"
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                :src="`https://ddragon.leagueoflegends.com/cdn/img/${runes?.groups[1].principal?.icon}`"
              />
              <div
                data-v-cbff5ddf=""
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              >
                <RuneTooltip v-if="runes" :rune="runes.groups[1].principal" />
              </div>
            </div>
          </div>
          <div data-v-15310f80="" class="main">
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  v-if="runes?.groups[2].principal"
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runes?.groups[2].principal?.icon}`"
                />
                <div
                  data-v-cbff5ddf=""
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                >
                  <RuneTooltip v-if="runes" :rune="runes.groups[2].principal" />
                </div>
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
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  v-if="runes?.groups[3].principal"
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runes?.groups[3].principal?.icon}`"
                />
                <div
                  data-v-cbff5ddf=""
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                >
                  <RuneTooltip v-if="runes" :rune="runes.groups[3].principal" />
                </div>
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
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  v-if="runes?.groups[4].principal"
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runes?.groups[4].principal?.icon}`"
                />
                <div
                  data-v-cbff5ddf=""
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                >
                  <RuneTooltip v-if="runes" :rune="runes.groups[4].principal" />
                </div>
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
            >
              <div data-v-ab218c16="" data-v-cbff5ddf-s="" class="rune path">
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${runes?.second?.icon}`"
                  v-if="runes?.second?.icon"
                />
              </div>
            </div>
            <div
              data-v-cbff5ddf=""
              data-v-ab218c16=""
              data-v-15310f80=""
              class="tooltip"
              v-for="(group, index) in runes?.groups"
              :key="index"
            >
              <div
                data-v-ab218c16=""
                data-v-cbff5ddf-s=""
                class="rune"
                v-if="group.second"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  data-v-ab218c16=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/img/${group.second.icon}`"
                />
                <div
                  data-v-cbff5ddf=""
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                >
                  <RuneTooltip :rune="group.second" />
                </div>
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
                v-if="shards?.principal"
              >
                <div
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shards?.principal?.image}`"
                  />
                  <div
                    data-v-cbff5ddf=""
                    class="box"
                    :style="{
                      position: 'absolute',
                      left: tooltipLeft,
                      top: tooltipTop,
                    }"
                  >
                    <ShardTooltip :shard="shards?.principal" />
                  </div>
                </div>
              </div>
              <div
                data-v-cbff5ddf=""
                data-v-ad54ad37=""
                data-v-15310f80=""
                class="tooltip"
                v-if="shards?.second"
              >
                <div
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shards?.second?.image}`"
                  />
                  <div
                    data-v-cbff5ddf=""
                    class="box"
                    :style="{
                      position: 'absolute',
                      left: tooltipLeft,
                      top: tooltipTop,
                    }"
                  >
                    <ShardTooltip :shard="shards?.second" />
                  </div>
                </div>
              </div>
              <div
                data-v-cbff5ddf=""
                data-v-ad54ad37=""
                data-v-15310f80=""
                class="tooltip"
                v-if="shards?.third"
              >
                <div
                  data-v-ad54ad37=""
                  data-v-cbff5ddf-s=""
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img
                    data-v-ad54ad37=""
                    data-v-cbff5ddf-s=""
                    :src="`/assets/icons/${shards?.third?.image}`"
                  />
                  <div
                    data-v-cbff5ddf=""
                    class="box"
                    :style="{
                      position: 'absolute',
                      left: tooltipLeft,
                      top: tooltipTop,
                    }"
                  >
                    <ShardTooltip :shard="shards?.third" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr
          data-v-15310f80=""
          :class="{
            hide: !runes?.principal,
          }"
        />
        <div data-v-15310f80="" class="itemsGroup">
          <div data-v-15310f80="" class="items">
            <div
              data-v-15310f80=""
              class="sheetItem"
              v-for="(item, index) in props.items?.core"
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
                    @mouseenter="updateMousePosition"
                    @mouseleave="resetMousePosition"
                  >
                    <img
                      data-v-7ab6e59a=""
                      data-v-cbff5ddf-s=""
                      class="img"
                      :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
                    />
                    <div
                      data-v-cbff5ddf=""
                      class="box"
                      :style="{
                        position: 'absolute',
                        left: tooltipLeft,
                        top: tooltipTop,
                      }"
                    >
                      <ItemTooltip
                        :item="item"
                        :from="getItemsFrom(item)"
                        :into="getItemsInto(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-v-15310f80=""
            :class="{
              sums: true,
              hide: !summonners?.principal,
            }"
          >
            <div
              data-v-cbff5ddf=""
              data-v-bab95e98=""
              data-v-15310f80=""
              class="tooltip"
              v-for="(summoner, index) in summonners"
              :key="index"
            >
              <div
                data-v-bab95e98=""
                data-v-cbff5ddf-s=""
                class="summoner"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  data-v-bab95e98=""
                  data-v-cbff5ddf-s=""
                  :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${summoner?.image.full}`"
                  v-if="summoner?.image.full"
                />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
