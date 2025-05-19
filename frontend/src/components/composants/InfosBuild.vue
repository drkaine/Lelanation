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
const isAdmin = computed(() => connexionStore.userName === import.meta.env.VITE_NAME)

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

const build = buildStore.statsCalculator(championStats, itemStats)

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
      response = await fetch(`${urlApiSave}/api/update/${path}${fileName}`, {
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
        const responseDelete = await fetch(
          `${urlApiSave}/api/build/${path}${buildStore.buildToEdit?.id}`,
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
      response = await fetch(`${urlApiSave}/api/save/${path}${fileName}`, {
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
      if (connexionStore.userName !== 'Lelariva') {
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

<style scoped>
.build-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.skill-up {
  max-width: 700px;
  margin: 0 auto 0 auto;
  padding: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--color-gold-300);
  margin-bottom: 0.5rem;
  font-size: var(--text-base);
}

.form-input,
.form-textarea {
  width: var(--width-all);
  padding: 0.75rem;
  background: var(--bg-dark);
  border: var(--border-size) solid var(--color-grey-100);
  border-radius: 4px;
  font-size: var(--text-sm);
  transition: border-color 0.2s;
  margin-top: 10px;
}

.form-textarea::placeholder,
.form-input::placeholder {
  color: var(--color-grey-50);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-gold-300);
  box-shadow: 0 0 0 2px rgba(205, 190, 145, 0.2);
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.visibility-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.visibility-toggle input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: var(--border-size) solid var(--color-grey-100);
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

.visibility-toggle input[type='checkbox']:checked + .checkmark {
  background-color: var(--color-gold-300);
  border-color: var(--color-gold-300);
}

.visibility-toggle input[type='checkbox']:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.certification-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.certification-toggle input[type='checkbox'] {
  display: none;
}

.certification-toggle input[type='checkbox']:checked + .checkmark {
  background-color: var(--color-gold-300);
  border-color: var(--color-gold-300);
}

.certification-toggle input[type='checkbox']:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-actions {
  display: flex;
  justify-content: center;
}

.btn-submit {
  padding: 0.75rem 2rem;
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover {
  background: var(--color-grey-100);
  transform: translateY(-1px);
}

.btn-submit:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .build-form {
    padding: 0.5rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.5rem;
  }

  .btn-submit {
    width: var(--width-all);
    padding: 0.5rem;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tabs-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid var(--color-grey-300);
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--color-grey-200);
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-button:hover {
  color: var(--color-gold-200);
}

.tab-button.active {
  color: var(--color-gold-300);
  font-weight: bold;
}

.tab-button.active:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-gold-300);
}

.tab-content {
  padding: 0.5rem;
}

.tab-pane {
  transition: opacity 0.2s ease-in-out;
}

@media (max-width: 768px) {
  .tabs-header {
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    font-size: var(--text-sm);
    flex: 1;
  }
}
</style>
