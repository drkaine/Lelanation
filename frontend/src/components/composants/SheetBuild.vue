<script setup lang="ts">
import ChampionTooltip from '@/components/Tooltip/ChampionTooltip.vue'
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
  <div class="sheet champions">
    <div
      :class="{
        name: true,
        hide: !name,
      }"
      style="color: var(--gold-lol)"
    >
      {{ name }}
    </div>
    <div class="sheet sheet-background">
      <div class="roles-container">
        <div class="roles-column">
          <div
            v-for="role in rolesListe.slice(0, 3)"
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
                width: isMobile ? '10px' : '18px',
                height: isMobile ? '10px' : '18px',
              }"
            />
          </div>
        </div>
        <div class="roles-row">
          <div
            v-for="role in rolesListe.slice(3)"
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
                width: isMobile ? '10px' : '18px',
                height: isMobile ? '10px' : '18px',
              }"
            />
          </div>
        </div>
      </div>
      <div class="type">darkaine</div>
      <div class="version">{{ props.version }}</div>
      <div class="wrap">
        <div class="shadow"></div>
        <div
          :class="{
            champion: true,
            hide: !champion,
          }"
        >
          <div class="tooltip">
            <div
              :class="{
                champion: true,
                hide: !champion,
              }"
              @mouseenter="updateMousePosition"
              @mouseleave="resetMousePosition"
            >
              <img
                :src="'/assets/icons/champions/' + champion?.image.full"
                :alt="champion?.name"
              />
            </div>
            <div
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
          :class="{
            name: true,
            hide: !champion,
          }"
        >
          {{ champion?.name }}
        </div>
        <hr
          :class="{
            hide: !runes?.principal,
          }"
        />
        <div
          :class="{
            runes: true,
            hide: !runes?.principal,
          }"
        >
          <div class="tooltip">
            <div
              class="rune"
              @mouseenter="updateMousePosition"
              @mouseleave="resetMousePosition"
            >
              <img
                v-if="runes?.groups[1].principal"
                :src="`/assets/icons/runes/${runes?.groups[1].principal?.id}.png`"
                :alt="runes?.groups[1].principal?.name"
              />
              <div
                class="box"
                :style="{
                  position: 'absolute',
                  left: tooltipLeft,
                  top: tooltipTop,
                }"
              ></div>
            </div>
          </div>
          <div class="main">
            <div class="tooltip">
              <div
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  v-if="runes?.groups[2].principal"
                  :src="`/assets/icons/runes/${runes?.groups[2].principal?.id}.png`"
                  :alt="runes?.groups[2].principal?.name"
                />
                <div
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                ></div>
              </div>
            </div>
            <div class="tooltip">
              <div
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  v-if="runes?.groups[3].principal"
                  :src="`/assets/icons/runes/${runes?.groups[3].principal?.id}.png`"
                  :alt="runes?.groups[3].principal?.name"
                />
                <div
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                ></div>
              </div>
            </div>
            <div class="tooltip">
              <div
                class="rune"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  v-if="runes?.groups[4].principal"
                  :src="`/assets/icons/runes/${runes?.groups[4].principal?.id}.png`"
                  :alt="runes?.groups[4].principal?.name"
                />
                <div
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                ></div>
              </div>
            </div>
            <div class="tooltip">
              <div class="rune path">
                <img
                  :src="`/assets/icons/runes/${runes?.second?.id}.png`"
                  v-if="runes?.second?.id"
                  :alt="runes?.second?.name"
                />
              </div>
            </div>
            <div
              class="tooltip"
              v-for="(group, index) in runes?.groups"
              :key="index"
            >
              <div
                class="rune"
                v-if="group.second"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  :src="`/assets/icons/runes/${group.second.id}.png`"
                  :alt="group.second?.name"
                />
                <div
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                ></div>
              </div>
            </div>
          </div>
          <div class="shards">
            <div class="wrap">
              <div class="tooltip" v-if="shards?.principal">
                <div
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img
                    :src="`/assets/icons/shards/${shards?.principal?.image}`"
                  />
                  <div
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
              <div class="tooltip" v-if="shards?.second">
                <div
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img :src="`/assets/icons/shards/${shards?.second?.image}`" />
                  <div
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
              <div class="tooltip" v-if="shards?.third">
                <div
                  class="shard"
                  @mouseenter="updateMousePosition"
                  @mouseleave="resetMousePosition"
                >
                  <img :src="`/assets/icons/shards/${shards?.third?.image}`" />
                  <div
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
          :class="{
            hide: !runes?.principal,
          }"
        />
        <div class="itemsGroup">
          <div class="items">
            <div
              class="sheetItem"
              v-for="(item, index) in props.items?.core"
              :key="index"
            >
              <div class="tip">
                <div class="tooltip">
                  <div
                    to="false"
                    class="item"
                    replace="false"
                    @mouseenter="updateMousePosition"
                    @mouseleave="resetMousePosition"
                  >
                    <img
                      class="img"
                      :src="`/assets/icons/items/${item.image.full}`"
                    />
                    <div
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
            :class="{
              sums: true,
              hide: !summonners?.principal,
            }"
          >
            <div
              class="tooltip"
              v-for="(summoner, index) in summonners"
              :key="index"
            >
              <div
                class="summoner"
                @mouseenter="updateMousePosition"
                @mouseleave="resetMousePosition"
              >
                <img
                  :src="`/assets/icons/summoners/${summoner?.image.full}`"
                  v-if="summoner?.image.full"
                />
                <div
                  class="box"
                  :style="{
                    position: 'absolute',
                    left: tooltipLeft,
                    top: tooltipTop,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <hr
          :class="{
            hide: !description,
          }"
        />
        <div class="text">{{ description }}</div>
      </div>
    </div>
  </div>
</template>
