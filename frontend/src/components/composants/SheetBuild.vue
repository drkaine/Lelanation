<script setup lang="ts">
import type { SummonerSelection } from '@/types/summoner'
import type { RunesSelection } from '@/types/rune'
import type { ShardSelection } from '@/types/shard'
import type { ItemSelection } from '@/types/item'
import type { Champion } from '@/types/champion'
import type { ChampionSkillsOrder } from '@/types/champion'
import { useRoleStore } from '@/stores/roleStore'
import { useGameVersionStore } from '@/stores/gameVersionStore'
import { useConnexionStore } from '@/stores/connexionStore'
import { useBuildStore } from '@/stores/buildStore'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const connexionStore = useConnexionStore()
const buildStore = useBuildStore()

const isLelarivaBuildPage = computed(() =>
  route.path.endsWith('/Lebuildarriva'),
)

const { t } = useI18n()
const roleStore = useRoleStore()
const gameVersionStore = useGameVersionStore()
const props = defineProps<{
  version: string | null
  name: string | null
  author: string | null
  description: string | null
  champion: Champion | null
  runes: RunesSelection | null
  summoners: SummonerSelection | null
  shards: ShardSelection | null
  items: ItemSelection | null
  skillOrder: ChampionSkillsOrder | null
  roles?: string[]
  certified?: boolean
  buildId?: string
  isLelarivaBuild?: boolean
}>()

const isAdmin = connexionStore.userName === import.meta.env.VITE_NAME

const isCertified = computed(() => props.certified === true)
const urlApiSave = import.meta.env.VITE_URL_API_SAVE

const isCommunityPage = computed(() => route.path === '/builds-publics')
const isBuildRecap = computed(() => route.path.includes('/build/'))

const showCertificationButton = computed(
  () =>
    isAdmin &&
    (isCommunityPage.value || isBuildRecap.value) &&
    !isLelarivaBuildPage.value &&
    !props.isLelarivaBuild,
)

const toggleCertification = async () => {
  if (!props.buildId) return

  try {
    const path = props.buildId.includes('lelariva/') ? 'lelariva/' : ''
    const fileName = props.buildId.replace('lelariva/', '')

    const response = await fetch(`${urlApiSave}/api/build/${path}${fileName}`)
    if (!response.ok) throw new Error('Erreur lors de la récupération du build')

    const buildData = await response.json()

    const updatedBuild = {
      ...buildData,
      certified: !buildData.certified,
    }

    const updateResponse = await fetch(
      `${urlApiSave}/api/update/${path}${fileName}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBuild),
      },
    )

    if (!updateResponse.ok)
      throw new Error('Erreur lors de la mise à jour du build')

    if (buildStore.buildToEdit?.id === props.buildId) {
      buildStore.updateBuild(updatedBuild)
    }

    emit('certification-toggled', !isCertified.value)
  } catch (error) {
    console.error('Erreur lors de la modification de la certification:', error)
  }
}

const emit = defineEmits(['certification-toggled'])

const selectedRoles = roleStore.selectedRoles
const rolesListe = ['top', 'jungle', 'mid', 'bot', 'support']

const isOutdatedVersion = computed(() => {
  return (
    props.version &&
    gameVersionStore.currentVersion &&
    props.version !== gameVersionStore.currentVersion
  )
})

const toggleRole = (role: string) => {
  if (props.roles) return

  if (selectedRoles.has(role)) {
    selectedRoles.delete(role)
  } else {
    selectedRoles.add(role)
  }
  roleStore.updateSelectedRoles(new Set(selectedRoles))
}

const isMobile = ref(window.innerWidth <= 768)

onMounted(() => {
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth <= 768
  })
})

const getRuneAtIndex = (index: number) => {
  if (index === 0) return props.runes?.principal
  return props.runes?.groups[index]?.principal || null
}

const getSecondaryRuneAtIndex = (index: number) => {
  return props.runes?.runeSecond[index] || null
}

const getSummonerByType = (type: 'principal' | 'second') => {
  return props.summoners?.[type] || null
}

const getShardAtIndex = (index: number) => {
  const type = index === 1 ? 'principal' : index === 2 ? 'second' : 'third'
  return props.shards?.[type] || null
}

const formatSkillSequence = (skillOrder: ChampionSkillsOrder | null) => {
  if (!skillOrder) return []

  const sequence: string[] = []
  for (let i = 1; i <= 18; i++) {
    for (const [skill, points] of Object.entries(skillOrder)) {
      if (points.includes(i)) {
        sequence.push(skill)
        break
      }
    }
  }
  return sequence
}

const hasSkillPoints = computed(() =>
  Object.values(props.skillOrder || {}).some(arr => arr && arr.length > 0),
)
</script>

<template>
  <div
    class="sheet-container"
    v-if="
      champion ||
      runes?.principal ||
      runes?.second ||
      items?.core ||
      (skillOrder && Object.values(skillOrder).some(arr => arr.length > 0))
    "
  >
    <div v-if="isOutdatedVersion" class="version-warning">
      {{ t('warning.version') }}
    </div>

    <div class="sheet-credits">
      <span class="credit-text">@lelanation</span>

      <span class="version-text">v{{ version }}</span>
      <img
        v-if="isCertified && !isAdmin && !props.isLelarivaBuild"
        class="certification-badge"
        src="/assets/images/lelariva-quality.png"
        alt="Certified by Lelariva"
      />
      <div
        v-if="showCertificationButton && !props.isLelarivaBuild"
        class="certification-badge-container"
        @click.stop="toggleCertification"
        :class="{ 'not-certified': !isCertified }"
      >
        <img
          v-if="isCertified"
          class="certification-badge clickable"
          src="/assets/images/lelariva-quality.png"
          alt="Certified by Lelariva"
          title="Cliquez pour décertifier"
        />
        <div
          v-else
          class="certification-placeholder"
          title="Cliquez pour certifier"
        ></div>
      </div>
    </div>
    <div v-if="author" class="separator"></div>
    <span v-if="author" class="author">{{ author }}</span>

    <div class="separator"></div>

    <div class="sheet-header" v-if="champion">
      <div class="champion-info">
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

    <div class="separator" v-if="hasSkillPoints"></div>
    <div
      class="skill-order-section"
      v-if="skillOrder && Object.values(skillOrder).some(arr => arr.length > 0)"
    >
      <div class="skill-sequence">
        <div
          v-for="(skill, index) in formatSkillSequence(skillOrder)"
          :key="index"
          class="skill-box"
          :class="{
            'skill-box-ultimate': skill === 'R',
            'skill-box-A': skill === 'A',
            'skill-box-Z': skill === 'Z',
            'skill-box-E': skill === 'E',
          }"
        >
          {{ skill }} {{ index + 1 }}
        </div>
      </div>
    </div>

    <div class="separator" v-if="description"></div>
    <div class="description-section" v-if="description">
      <p class="description-text">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.version-warning {
  background-color: rgba(220, 38, 38, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: var(--text-sm);
  font-weight: 500;
  margin-bottom: 12px;
  text-align: center;
  border: 1px solid rgba(220, 38, 38, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.certification-badge {
  height: 40px;
  width: auto;
  vertical-align: middle;
  margin-left: 6px;
  border-radius: 100%;
  border: 2px solid var(--color-gold-300);
}

.certification-badge.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.certification-badge.clickable:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(200, 170, 110, 0.5);
}

.certification-badge-container {
  display: inline-block;
  vertical-align: middle;
  margin-left: 6px;
  cursor: pointer;
}

.certification-badge-container.not-certified {
  height: 40px;
  width: 40px;
  border-radius: 100%;
  border: 2px dashed var(--color-gold-300);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.certification-badge-container.not-certified:hover {
  border-color: var(--color-gold-400);
  background-color: rgba(200, 170, 110, 0.1);
  transform: scale(1.1);
}

.certification-placeholder {
  height: 36px;
  width: 36px;
  border-radius: 100%;
}

.certification-container {
  display: none;
}

.author {
  color: var(--color-gold-300);
  font-size: var(--text-base);
  font-weight: 1000;
  text-align: center;
  width: 100%;
  display: block;
  margin: 10px 0;
}

.shard-slot img {
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 50%;
}

.sheet-container {
  background: var(--gradient-primary);
  border: var(--border-size) solid var(--color-blue-300);
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
  background: linear-gradient(
    135deg,
    #0a1428 0%,
    #091428 20%,
    #132b45 40%,
    #1e2328 60%,
    rgba(200, 170, 110, 0.1) 80%,
    #0a1428 100%
  );
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
  padding-top: 0.5rem;
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
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 50%;
  overflow: hidden;
}

.champion-portrait img {
  width: var(--width-all);
  height: var(--height-all);
  object-fit: cover;
}

.champion-name {
  color: var(--color-gold-300);
  font-weight: 500;
  font-size: var(--text-base);
}

.sheet-title {
  color: var(--color-gold-300);
  font-size: var(--text-base);
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
  flex-wrap: wrap;
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
  padding: 3px;
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
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 50%;
  overflow: hidden;
}

.rune-slot-sheet {
  width: 32px;
  height: 32px;
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rune-slot-sheet img {
  width: var(--width-all);
  height: var(--height-all);
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
  border: var(--border-size) solid var(--color-gold-300);
}

.runes-secondary-sheet .rune-tier:first-child .rune-slot-sheet img {
  width: 24px;
  height: 24px;
}

.runes-secondary-sheet .rune-tier {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  width: var(--width-all);
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
  border: var(--border-size) solid var(--color-gold-300);
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
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.item-slot {
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  overflow: hidden;
}

.item-slot img {
  width: var(--width-all);
  height: var(--height-all);
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
  color: var(--color-gold-500);
  font-weight: 500;
  font-size: var(--text-base);
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
  color: var(--color-gold-500);
  font-size: var(--text-base);
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
  color: var(--color-gold-500);
  font-size: var(--text-base);
}

.spell-key {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  color: var(--color-gold-300);
  font-weight: 600;
  font-size: var(--text-base);
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
  background: var(--color-gold-300);
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
    height: 100% !important;
  }

  .shard-slot img {
    width: 35px !important;
    height: 35px !important;
  }
  .item-slot {
    width: 35px !important;
    height: 35px !important;
  }

  .sheet-credits {
    padding: 0.25rem 0.5rem;
    font-size: var(--text-xs);
  }

  .description-section {
    padding: 0.75rem;
  }

  .description-text {
    font-size: var(--text-xs);
  }

  .skill-box {
    width: 25px;
    height: 25px;
    font-size: var(--text-xs);
  }
}

@media (min-width: 768px) {
  .summoner-slot img {
    height: 100%;
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
  border: var(--border-size) solid var(--color-gold-300);
  border-radius: 4px;
  overflow: hidden;
}

.item-slot img {
  width: var(--width-all);
  height: var(--height-all);
  object-fit: cover;
}

.sheet-credits {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--color-gold-500);
  font-size: var(--text-sm);
  opacity: 0.8;
}

.credit-text {
  color: var(--color-grey-50);
  font-weight: 500;
}

.version-text {
  color: var(--color-grey-50);
}

.description-section {
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 4px;
}

.description-text {
  color: var(--color-blue-50);
  font-size: var(--text-sm);
  line-height: 1.5;
  white-space: pre-wrap;
  margin: 0;
  font-style: italic;
}

.skill-order-section {
  padding: 1rem;
}

.skill-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  padding: 1rem;
}

.skill-box {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-grey-800);
  border: 1px solid var(--color-gold-300);
  border-radius: 4px;
  color: var(--color-gold-300);
  font-weight: bold;
  font-size: var(--text-sm);
}

.skill-box-ultimate {
  background: var(--color-grey-500);
  color: var(--color-gold-200);
}

.skill-box-A {
  background: var(--color-blue-600);
  color: var(--color-gold-50);
}

.skill-box-Z {
  background: var(--color-blue-600);
  color: var(--color-grey-50);
}

.skill-box-E {
  background: var(--color-blue-600);
  color: var(--color-blue-50);
}
</style>
