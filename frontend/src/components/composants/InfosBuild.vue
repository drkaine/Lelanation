<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import { useBuildStore } from '@/stores/buildStore'
import { useRoleStore } from '@/stores/roleStore'
import { useStepStore } from '@/stores/stepStore'
import { useConnexionStore } from '@/stores/connexionStore'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import version from '@/assets/files/data/lastVersion.json'
import { useRouter } from 'vue-router'
import type { BuildData } from '@/types/build'
import SkillUp from './SkillUp.vue'
import StatistiquesBuild from './StatistiquesBuild.vue'

const router = useRouter()

const activeTab = ref('skills')

const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const stepStore = useStepStore()
const itemStore = useItemStore()
const buildStore = useBuildStore()
const roleStore = useRoleStore()
const connexionStore = useConnexionStore()
const isAdmin = computed(
  () => connexionStore.userName === import.meta.env.VITE_NAME,
)

const name = ref(buildStore.buildToEdit ? buildStore.buildToEdit.name : '')
const description = ref(
  buildStore.buildToEdit ? buildStore.buildToEdit.description : '',
)
const isVisible = ref(
  buildStore.buildToEdit ? buildStore.buildToEdit.visible : true,
)
const isCertified = ref(
  buildStore.buildToEdit ? buildStore.buildToEdit.certified || false : false,
)
const author = ref(
  isAdmin.value
    ? 'Lelariva'
    : buildStore.buildToEdit
      ? buildStore.buildToEdit.author
      : '',
)
const championStats =
  championStore.$state.selectedChampion !== null
    ? championStore.$state.selectedChampion.stats
    : {
        hp: 0,
        hpperlevel: 0,
        mp: 0,
        mpperlevel: 0,
        movespeed: 0,
        armor: 0,
        armorperlevel: 0,
        spellblock: 0,
        spellblockperlevel: 0,
        attackrange: 0,
        hpregen: 0,
        hpregenperlevel: 0,
        mpregen: 0,
        mpregenperlevel: 0,
        crit: 0,
        critperlevel: 0,
        attackdamage: 0,
        attackdamageperlevel: 0,
        attackspeedperlevel: 0,
        attackspeed: 0,
      }

const itemStats = itemStore.$state.ItemsSelection.stats

const build = buildStore.statsCalculatorWithShards(
  championStats,
  itemStats,
  championStore.$state.selectedChampion ?? undefined,
  shardStore.$state.shardsSelection,
)

const submitForm = async () => {
  let fileName = `${uuidv4()}.json`
  if (buildStore.buildToEdit?.id) {
    fileName = buildStore.buildToEdit.id
  }

  if (
    !isVisible.value &&
    !(buildStore.buildToEdit?.id || '').includes('wait_')
  ) {
    fileName = 'wait_' + fileName
  } else if (
    isVisible.value &&
    (buildStore.buildToEdit?.id || '').includes('wait_')
  ) {
    fileName = fileName.replace('wait_', '')
  }

  const apiFileName = fileName.replace('.json', '')

  const data = {
    id: fileName,
    roles: Array.from(roleStore.selectedRoles),
    name: name.value,
    author: author.value,
    description: description.value,
    version: version,
    visible: isVisible.value,
    certified: isAdmin.value ? false : isCertified.value,
    sheet: {
      champion: championStore.$state.selectedChampion,
      runes: runeStore.$state.runesSelection,
      summoners: summonerStore.$state.summonerSelection,
      shards: shardStore.$state.shardsSelection,
      items: itemStore.$state.ItemsSelection,
      skillOrder: championStore.$state.championSkillsOrder,
    },
    buildStats: build,
  }
  try {
    let response
    let path = ''

    if (isAdmin.value) {
      path = 'lelariva/'
    }

    if (buildStore.buildToEdit) {
      response = await fetch(`${urlApiSave}/api/update/${path}${apiFileName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (
        ((buildStore.buildToEdit?.id || '').includes('wait_') &&
          isVisible.value) ||
        (!(buildStore.buildToEdit?.id || '').includes('wait_') &&
          !isVisible.value)
      ) {
        const deleteFileName = (buildStore.buildToEdit?.id || '').replace(
          '.json',
          '',
        )
        const responseDelete = await fetch(
          `${urlApiSave}/api/build/${path}${deleteFileName}`,
          {
            method: 'DELETE',
          },
        )

        if (!responseDelete.ok) throw new Error('Erreur lors de la suppression')

        buildStore.updateBuild(
          data as BuildData,
          buildStore.buildToEdit?.id || '',
        )
      }
    } else {
      response = await fetch(`${urlApiSave}/api/save/${path}${apiFileName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    }

    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde')
    }

    if (buildStore.buildToEdit) {
      buildStore.updateBuild(data as BuildData)
    } else {
      if (!isAdmin.value) {
        buildStore.saveBuild(data as BuildData)
      }
    }

    championStore.resetChampionSelection()
    runeStore.resetRunesSelection()
    summonerStore.resetSummonersSelection()
    shardStore.resetShardsSelection()
    itemStore.resetItemsSelection()
    roleStore.resetRoles()
    stepStore.resetSteps()
    buildStore.setBuildToEdit(null)

    router.push({
      name: 'build',
      params: {
        fileName: fileName,
      },
    })
  } catch (error) {
    console.error('Erreur:', error)
  }
}
</script>

<template>
  <div class="tabs-container">
    <div class="tabs-header" v-show="championStore.$state.selectedChampion">
      <button
        :class="['tab-button', { active: activeTab === 'skills' }]"
        @click="activeTab = 'skills'"
      >
        {{ $t('infos-build.skills') }}
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'stats' }]"
        @click="activeTab = 'stats'"
      >
        {{ $t('infos-build.stats') }}
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'form' }]"
        @click="activeTab = 'form'"
      >
        {{ $t('infos-build.form') }}
      </button>
    </div>

    <div class="tab-content">
      <div
        v-show="activeTab === 'stats' && championStore.$state.selectedChampion"
        class="tab-pane"
      >
        <StatistiquesBuild
          :build="build"
          :total="itemStore.$state.ItemsSelection.gold.total"
          :shards="shardStore.$state.shardsSelection"
          :champion="championStore.$state.selectedChampion ?? undefined"
        />
      </div>

      <div
        v-show="activeTab === 'skills' && championStore.$state.selectedChampion"
        class="tab-pane skill-up"
      >
        <SkillUp />
      </div>

      <div v-show="activeTab === 'form'" class="tab-pane">
        <form @submit.prevent="submitForm" class="build-form">
          <div class="form-group">
            <label>
              {{ $t('infos-build.name') }} *
              <input
                maxlength="58"
                type="text"
                required
                v-model="name"
                placeholder="Nom du build"
                class="form-input"
              />
            </label>
          </div>

          <div class="form-group">
            <label>
              {{ $t('infos-build.author') }} *
              <input
                maxlength="58"
                type="text"
                required
                v-model="author"
                placeholder="Pseudo de l'auteur"
                class="form-input"
              />
            </label>
          </div>

          <div class="form-group">
            <label class="desc">
              {{ $t('infos-build.description') }}
              <textarea
                type="text"
                maxlength="1500"
                v-model="description"
                placeholder="Description du build"
                class="form-textarea"
              ></textarea>
            </label>
          </div>

          <div class="form-group">
            <label class="visibility-toggle">
              <input type="checkbox" v-model="isVisible" />
              <span class="checkmark"></span>
              {{ $t('infos-build.public') }}
            </label>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">
              {{ $t('infos-build.finish') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
