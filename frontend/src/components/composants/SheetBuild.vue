<script setup lang="ts">
import ChampionTooltip from '@/components/Tooltip/ChampionTooltip.vue'
import SummonerTooltip from '@/components/Tooltip/SummonerTooltip.vue'
import RuneTooltip from '@/components/Tooltip/RuneTooltip.vue'
import ShardTooltip from '@/components/Tooltip/ShardTooltip.vue'
import ItemTooltip from '@/components/Tooltip/ItemTooltip.vue'
import type { SummonerSelection } from '@/types/summoner'
import type { RunesSelection } from '@/types/rune'
import type { ShardSelection } from '@/types/shard'
import type { Item, ItemSelection } from '@/types/item'
import type { Champion } from '@/types/champion'
import itemsFiles from '@/assets/files/data/item.json'
import { TooltipCoordonne } from '../script/TooltipCoordonne'
import { useRoleStore } from '@/stores/roleStore'
import { ref, onMounted } from 'vue'

const roleStore = useRoleStore()

const props = defineProps<{
  version: string | null
  name: string | null
  description: string | null
  champion: Champion | null
  runes: RunesSelection | null
  summonners: SummonerSelection | null
  shards: ShardSelection | null
  items: ItemSelection | null
  roles?: string[]
}>()

const selectedRoles = roleStore.selectedRoles
const rolesListe = ['top', 'jungle', 'mid', 'bot', 'support']

const toggleRole = (role: string) => {
  if (props.roles) return

  if (selectedRoles.has(role)) {
    selectedRoles.delete(role)
  } else {
    selectedRoles.add(role)
  }
  roleStore.updateSelectedRoles(new Set(selectedRoles))
}

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

const isMobile = ref(window.innerWidth <= 768)

onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768
  })
})
</script>

<template>
  <div data-v-b6709614="" class="sheet champions">
    <div
      data-v-15310f80=""
      :class="{
        name: true,
        hide: !name,
      }"
      style="color: var(--gold-1)"
    >
      {{ name }}
    </div>
    <div data-v-15310f80="" data-v-b6709614="" class="sheet sheet-background">
      <div class="roles-container">
        <div
          v-for="role in rolesListe"
          :key="role"
          class="role-icon"
          :class="{
            'role-inactive':
              !selectedRoles.has(role) && !props.roles?.includes(role),
            'role-mobile': isMobile,
          }"
          @click="toggleRole(role)"
        >
          <img
            :src="`/assets/icons/roles/${role}.png`"
            :alt="role"
            :style="{
              width: isMobile ? '18px' : '24px',
              height: isMobile ? '18px' : '24px',
            }"
          />
        </div>
      </div>
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
                :src="'/assets/icons/champions/' + champion?.image.full"
                :alt="champion?.name"
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
                :src="`/assets/icons/runes/${runes?.groups[1].principal?.id}.png`"
                :alt="runes?.groups[1].principal?.name"
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
                  :src="`/assets/icons/runes/${runes?.groups[2].principal?.id}.png`"
                  :alt="runes?.groups[2].principal?.name"
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
                  :src="`/assets/icons/runes/${runes?.groups[3].principal?.id}.png`"
                  :alt="runes?.groups[3].principal?.name"
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
                  :src="`/assets/icons/runes/${runes?.groups[4].principal?.id}.png`"
                  :alt="runes?.groups[4].principal?.name"
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
                  :src="`/assets/icons/runes/${runes?.second?.id}.png`"
                  v-if="runes?.second?.id"
                  :alt="runes?.second?.name"
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
                  :src="`/assets/icons/runes/${group.second.id}.png`"
                  :alt="group.second?.name"
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
                    :src="`/assets/icons/shards/${shards?.principal?.image}`"
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
                    :src="`/assets/icons/shards/${shards?.second?.image}`"
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
                    :src="`/assets/icons/shards/${shards?.third?.image}`"
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
                      :src="`/assets/icons/items/${item.image.full}`"
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
                  :src="`/assets/icons/summoners/${summoner?.image.full}`"
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
        <hr
          data-v-15310f80=""
          :class="{
            hide: !description,
          }"
        />
        <div data-v-15310f80="" class="text">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roles-container {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 1;
}

.role-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.role-inactive {
  opacity: 0.3;
  filter: grayscale(100%);
}

.role-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.sheet-title {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--slate-12);
  font-weight: 600;
}

.sheet.champions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
