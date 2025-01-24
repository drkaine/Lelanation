<script setup lang="ts">
import type { SummonerSelection } from '@/types/summoner'
import type { RunesSelection } from '@/types/rune'
import type { ShardSelection } from '@/types/shard'
import type { ItemSelection } from '@/types/item'
import type { Champion } from '@/types/champion'
// import itemsFiles from '@/assets/files/data/item.json'
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

// const getItemsFrom = (item: Item) => {
//   return (
//     item.from
//       ?.map((id: string) => itemsFiles.data[id as keyof typeof itemsFiles.data])
//       .filter(Boolean) || []
//   )
// }

// const getItemsInto = (item: Item) => {
//   return (
//     item.into
//       ?.map((id: string) => itemsFiles.data[id as keyof typeof itemsFiles.data])
//       .filter(Boolean) || []
//   )
// }

const isMobile = ref(window.innerWidth <= 768)

onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768
  })
})

// const spellOrder = computed(() => {
//   return [
//     'Q',
//     'W',
//     'E',
//     'Q',
//     'Q',
//     'R',
//     'Q',
//     'W',
//     'Q',
//     'W',
//     'R',
//     'W',
//     'W',
//     'E',
//     'E',
//     'R',
//     'E',
//     'E',
//   ]
// })

// const spellGroups = computed(() => {
//   return spellOrder.value.reduce((acc: { [key: string]: number }, spell) => {
//     acc[spell] = (acc[spell] || 0) + 1
//     return acc
//   }, {})
// })

const getRuneAtIndex = (index: number) => {
  if (index === 0) return props.runes?.principal
  return props.runes?.groups[index]?.principal || null
}

const getSecondaryRuneAtIndex = (index: number) => {
  return props.runes?.runeSecond[index] || null
}

const getSummonerByType = (type: 'principal' | 'second') => {
  return props.summonners?.[type] || null
}

const getShardAtIndex = (index: number) => {
  const type = index === 1 ? 'principal' : index === 2 ? 'second' : 'third'
  return props.shards?.[type] || null
}
</script>

<template>
  <div class="sheet-container">
    <div class="sheet-header">
      <div class="champion-info" v-if="champion">
        <div class="champion-portrait">
          <img
            :src="`/assets/icons/champions/${champion?.image.full}`"
            :alt="champion?.name"
          />
        </div>
        <span class="champion-name">{{ champion?.name }}</span>
      </div>

      <h2 class="sheet-title">{{ name }}</h2>

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
                width: isMobile ? '25px' : '30px',
                height: isMobile ? '25px' : '30px',
              }"
            />
          </div>
        </div>
        <div class="roles-column">
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
                width: isMobile ? '25px' : '30px',
                height: isMobile ? '25px' : '30px',
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="separator" v-if="runes?.principal"></div>

    <div class="runesPage-sheet" v-if="runes?.principal">
      <div class="runes-row primary-row">
        <div class="primary-runes">
          <div class="column-header">
            <div class="header-icon">
              <img
                v-if="runes?.principal"
                :src="`/assets/icons/runes/${runes.principal.id}.png`"
                :alt="runes.principal.name"
              />
            </div>
          </div>
          <div class="runes-slots">
            <div
              v-for="index in 4"
              :key="index"
              class="rune-slot-sheet"
              :class="{ keystone: index === 0 }"
            >
              <img
                v-if="getRuneAtIndex(index)"
                :src="`/assets/icons/runes/${getRuneAtIndex(index)?.id}.png`"
                :alt="getRuneAtIndex(index)?.name"
              />
            </div>
          </div>
        </div>

        <div class="summoner-spells-sheet">
          <div
            v-for="type in ['principal', 'second'] as const"
            :key="type"
            class="summoner-slot"
          >
            <img
              v-if="getSummonerByType(type)"
              :src="`/assets/icons/summoners/${getSummonerByType(type)?.image.full}`"
              :alt="getSummonerByType(type)?.name"
            />
          </div>
        </div>
      </div>

      <div class="runes-row secondary-row">
        <div class="secondary-runes">
          <div class="column-header">
            <div class="header-icon">
              <img
                v-if="runes?.second"
                :src="`/assets/icons/runes/${runes.second.id}.png`"
                :alt="runes.second.name"
              />
            </div>
          </div>
          <div class="runes-slots horizontal">
            <div v-for="index in 2" :key="index" class="rune-slot-sheet">
              <img
                v-if="getSecondaryRuneAtIndex(index - 1)"
                :src="`/assets/icons/runes/${getSecondaryRuneAtIndex(index - 1)?.id}.png`"
                :alt="getSecondaryRuneAtIndex(index - 1)?.name"
              />
            </div>
          </div>
        </div>

        <div class="shards-row">
          <div v-for="index in 3" :key="'shard-' + index" class="shard-slot">
            <img
              v-if="getShardAtIndex(index)"
              :src="`/assets/icons/shards/${getShardAtIndex(index)?.image}`"
              :alt="getShardAtIndex(index)?.description"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="separator" v-if="items?.core"></div>
    <div class="items-section" v-if="items?.core">
      <div class="items-row">
        <div v-for="item in items?.core" :key="item.name" class="item-slot">
          <img
            :src="`/assets/icons/items/${item.image.full}`"
            :alt="item.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shard-slot img {
  border: 2px solid var(--gold-lol);
  border-radius: 50%;
}

.sheet-container {
  background: linear-gradient(
    135deg,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 40%) 0%
      )
      0%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 40%) 0%
      )
      5%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 35%) 5%
      )
      10%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 35%) 10%
      )
      15%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 30%) 15%
      )
      20%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 30%) 20%
      )
      25%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 25%) 25%
      )
      30%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 25%) 30%
      )
      35%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 20%) 35%
      )
      40%,
    color-mix(
        in srgb,
        var(--base-dark),
        color-mix(in srgb, var(--black), black 20%) 40%
      )
      45%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 15%) 45%
      )
      50%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 15%) 50%
      )
      55%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 10%) 55%
      )
      60%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 10%) 60%
      )
      65%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 5%) 65%
      )
      70%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 5%) 70%
      )
      75%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 0%) 75%
      )
      80%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 0%) 80%
      )
      85%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 0%) 85%
      )
      90%,
    color-mix(
        in srgb,
        var(--final-blue),
        color-mix(in srgb, var(--black), black 0%) 90%
      )
      95%,
    var(--final-blue) 100%
  );
  border: 2px solid var(--nox-red);
  box-shadow: 0 0 20px rgba(74, 17, 21, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.sheet-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(45deg, #4a1115, #771920, #4a1115);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.champion-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.champion-portrait {
  width: 64px;
  height: 64px;
  border: 2px solid var(--gold-lol);
  border-radius: 50%;
  overflow: hidden;
}

.champion-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.champion-name {
  color: var(--gold-lol);
  font-weight: 500;
  font-size: 14px;
}

.sheet-title {
  color: var(--sand-1);
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

.separator {
  height: 1px;
  opacity: 0.3;
  margin: 16px 0;
}

.runes-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.primary-runes,
.secondary-runes {
  display: flex;
  align-items: center;
  gap: 12px;
}

.runes-slots {
  display: flex;
  align-items: center;
  gap: 12px;
}

.runes-slots.horizontal {
  flex-direction: row;
}

.summoner-spells-sheet {
  display: flex;
  gap: 8px;
  align-items: center;
}

.shards-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.keystone {
  width: 48px;
  height: 48px;
}

.keystone img {
  width: 40px;
  height: 40px;
}

.rune-slot-sheet {
  width: 32px;
  height: 32px;
}

.roles-container {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.roles-column {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--black-2);
  padding: 3px;
}

.role-icon:hover {
  background: var(--black-1);
}

.role-inactive {
  opacity: 0.3;
  filter: grayscale(100%);
}

.role-inactive:hover {
  opacity: 0.5;
}

.role-mobile {
  width: 30px;
  height: 30px;
  padding: 2px;
}

.runesPage-sheet {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.primary-runes {
  display: flex;
  align-items: flex-start;
}

.keystone {
  width: 56px;
  height: 56px;
  border: 2px solid var(--gold-lol);
  border-radius: 50%;
  overflow: hidden;
}

.rune-slot-sheet {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gold-lol);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rune-slot-sheet img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.rune-tier {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.rune-tier .rune-slot-sheet {
  width: 24px;
  height: 24px;
}

.rune-tier .rune-slot-sheet img {
  width: 20px;
  height: 20px;
}

.runes-secondary-sheet {
  width: calc(50% - 4px);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.runes-secondary-sheet .rune-tier:first-child .rune-slot-sheet {
  width: 32px;
  height: 32px;
  border: 2px solid var(--gold-3);
}

.runes-secondary-sheet .rune-tier:first-child .rune-slot-sheet img {
  width: 24px;
  height: 24px;
}

.runes-secondary-sheet .rune-tier {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  width: 100%;
}

.runes-secondary-sheet .rune-tier .rune-slot-sheet {
  width: 24px;
  height: 24px;
}

.runes-secondary-sheet .rune-tier .rune-slot-sheet img {
  width: 20px;
  height: 20px;
}

.keystone-secondary {
  width: 48px;
  height: 48px;
  border: 2px solid var(--gold-3);
  border-radius: 50%;
  overflow: hidden;
}

.secondary-runes {
  display: flex;
  align-items: center;
  gap: 12px;
}

.side-spells {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: auto;
}

.shards-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summoner-slot-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.summoner-slot {
  width: 25px;
  height: 25px;
  border: 1px solid var(--gold-lol);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.item-slot {
  border: 2px solid var(--gold-lol);
  border-radius: 4px;
  overflow: hidden;
}

.item-slot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.spell-order {
  border-radius: 4px;
  padding: 16px;
}

.spell-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.spell-title {
  color: var(--sand-1);
  font-weight: 500;
  font-size: 14px;
}

.spell-summary {
  display: flex;
  gap: 16px;
}

.spell-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.spell-value {
  color: var(--sand-2);
  font-size: 12px;
}

.spell-sequence {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32px, 1fr));
  gap: 8px;
}

.spell-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.level-number {
  color: var(--sand-2);
  font-size: 10px;
}

.spell-key {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--gold-3);
  border-radius: 4px;
  color: var(--gold-lol);
  font-weight: 600;
  font-size: 12px;
}

.spell-key.q {
  background: var(--blue-3);
}
.spell-key.w {
  background: var(--red-3);
}
.spell-key.e {
  background: var(--green-3);
}
.spell-key.r {
  background: var(--gold-3);
}

@media (max-width: 768px) {
  .header-icon {
    width: 45px !important;
    height: 45px !important;
  }

  .header-icon img {
    width: 35px !important;
    height: 35px !important;
  }

  .summoner-slot img {
    width: 35px !important;
    height: 35px !important;
  }

  .shard-slot img {
    width: 35px !important;
    height: 35px !important;
  }
  .item-slot {
    width: 35px !important;
    height: 35px !important;
  }
}

@media (min-width: 768px) {
  .summoner-slot img {
    width: 35px;
    height: 35px;
  }

  .shard-slot img {
    width: 40px;
    height: 40px;
  }

  .sheet-container {
    width: 450px;
  }

  .roles-column {
    gap: 10px !important;
  }

  .wrap-sheet {
    gap: 24px;
  }

  .runes-primary-sheet,
  .runes-secondary-sheet {
    width: calc(50% - 12px);
  }

  .rune-tier {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .rune-slot-sheet-container {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .header-icon {
    width: 45px;
    height: 45px;
  }

  .header-icon img {
    width: 45px;
    height: 45px;
  }

  .rune-slot-sheet {
    width: 35px;
    height: 35px;
  }

  .rune-slot-sheet img {
    width: 35px;
    height: 35px;
  }

  .summoner-slot {
    width: 35px;
    height: 35px;
  }

  .summoner-spells-sheet {
    gap: 12px;
  }

  .summoner-spell-row {
    gap: 8px;
  }

  .runes-secondary-sheet {
    width: calc(50% - 12px);
  }

  .runes-secondary-sheet .rune-tier:first-child .rune-slot-sheet {
    width: 35px;
    height: 35px;
  }

  .runes-secondary-sheet .rune-tier:first-child .rune-slot-sheet img {
    width: 35px;
    height: 35px;
  }

  .runes-secondary-sheet .rune-tier .rune-slot-sheet {
    width: 35px;
    height: 35px;
  }

  .runes-secondary-sheet .rune-tier .rune-slot-sheet img {
    width: 35px;
    height: 35px;
  }

  .runes-secondary-sheet .rune-tier {
    justify-content: flex-start;
    padding-left: 8px;
  }

  .runes-secondary-sheet .shard-tier {
    justify-content: flex-start;
    padding-left: 8px;
  }
}

@media (min-width: 1024px) {
  .header-icon {
    width: 50px;
    height: 50px;
  }

  .shard-slot img {
    width: 35px;
    height: 35px;
  }

  .header-icon img {
    width: 40px;
    height: 40px;
  }

  .rune-slot-sheet {
    width: 35px;
    height: 35px;
  }

  .rune-slot-sheet img {
    width: 35px;
    height: 35px;
  }

  .summoner-slot {
    width: 35px;
    height: 35px;
  }

  .rune-tier {
    gap: 16px;
  }

  .shard-tier {
    gap: 12px;
  }

  .runes-secondary-sheet .rune-tier {
    justify-content: flex-start;
    padding-left: 8px;
  }

  .runes-secondary-sheet .shard-tier {
    justify-content: flex-start;
    padding-left: 8px;
  }
}

.items-section {
  margin-top: 24px;
}

.items-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.item-slot {
  width: 45px;
  height: 45px;
  border: 2px solid var(--gold-lol);
  border-radius: 4px;
  overflow: hidden;
}

.item-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
