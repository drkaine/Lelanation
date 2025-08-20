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

const connexionStore = useConnexionStore()
const buildStore = useBuildStore()

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

const toggleCertification = async () => {
  if (!props.buildId) return

  try {
    const path = props.buildId.includes('lelariva/') ? 'lelariva/' : ''
    const fileName = props.buildId.replace('lelariva/', '')

    const apiFileName = fileName.replace('.json', '')

    const response = await fetch(
      `${urlApiSave}/api/build/${path}${apiFileName}`,
    )
    if (!response.ok) throw new Error('Erreur lors de la récupération du build')

    const buildData = await response.json()

    const updatedBuild = {
      ...buildData,
      certified: !buildData.certified,
    }

    const updateResponse = await fetch(
      `${urlApiSave}/api/update/${path}${apiFileName}`,
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

    emit('certification-toggled', updatedBuild.certified)
  } catch (error) {
    console.error('Erreur lors de la modification de la certification:', error)
  }
}

const emit = defineEmits(['certification-toggled'])

const selectedRoles = roleStore.selectedRoles
const rolesListe = ['top', 'jungle', 'mid', 'bot', 'support']

const compareVersions = (version1: string, version2: string): number => {
  if (!version1 || !version2) return 0

  const v1Parts = version1.split('.').map(n => parseInt(n, 10))
  const v2Parts = version2.split('.').map(n => parseInt(n, 10))

  const maxLength = Math.max(v1Parts.length, v2Parts.length)
  while (v1Parts.length < maxLength) v1Parts.push(0)
  while (v2Parts.length < maxLength) v2Parts.push(0)

  for (let i = 0; i < maxLength; i++) {
    if (v1Parts[i] < v2Parts[i]) return -1
    if (v1Parts[i] > v2Parts[i]) return 1
  }

  return 0
}

const isOutdatedVersion = computed(() => {
  if (!props.version || !gameVersionStore.currentVersion) {
    return false
  }

  const comparison = compareVersions(
    props.version,
    gameVersionStore.currentVersion,
  )
  return comparison < 0
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
        v-if="isCertified && !(isAdmin && !props.isLelarivaBuild)"
        class="certification-badge"
        src="/assets/images/lelariva-quality.png"
        alt="Certified by Lelariva"
      />
      <div
        v-if="isAdmin && !props.isLelarivaBuild"
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
              :alt="`Rôle ${role}`"
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
              :alt="`Rôle ${role}`"
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
