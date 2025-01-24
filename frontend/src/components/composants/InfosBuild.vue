<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import { useBuildStore } from '@/stores/buildStore'
import { useRoleStore } from '@/stores/roleStore'
import { useConnexionStore } from '@/stores/connexionStore'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import version from '@/assets/files/data/lastVersion.json'
import { useRouter } from 'vue-router'
import type { BuildData } from '@/types/build'

const router = useRouter()

const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
const buildStore = useBuildStore()
const roleStore = useRoleStore()
const connexionStore = useConnexionStore()

const name = ref(buildStore.buildToEdit ? buildStore.buildToEdit.name : '')
const description = ref(
  buildStore.buildToEdit ? buildStore.buildToEdit.description : '',
)
const isVisible = ref(buildStore.visibleBuild)

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
    if (isVisible.value && fileName.startsWith('wait_')) {
      fileName = fileName.replace('wait_', '')
    }
  } else {
    if (connexionStore.isLoggedIn) {
      fileName = `lelariva_` + fileName
      fileName = isVisible.value ? fileName : 'wait_' + fileName
    }
  }

  const data = {
    id: fileName,
    roles: Array.from(roleStore.selectedRoles),
    name: name.value,
    description: description.value,
    version: version,
    visible: connexionStore.isLoggedIn ? isVisible.value : true,
    sheet: {
      champion: championStore.$state.selectedChampion,
      runes: runeStore.$state.runesSelection,
      summoners: summonerStore.$state.summonerSelection,
      shards: shardStore.$state.shardsSelection,
      items: itemStore.$state.ItemsSelection,
    },
    buildStats: build,
  }

  try {
    let response
    if (buildStore.buildToEdit) {
      response = await fetch(`${urlApiSave}/api/update/${fileName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } else {
      response = await fetch(`${urlApiSave}/api/save/${fileName}`, {
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
      if (!connexionStore.isLoggedIn) {
        buildStore.saveBuild(data as BuildData)
      }
    }

    championStore.resetChampionSelection()
    runeStore.resetRunesSelection()
    summonerStore.resetSummonersSelection()
    shardStore.resetShardsSelection()
    itemStore.resetItemsSelection()
    roleStore.resetRoles()
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
  <form @submit.prevent="submitForm" class="build-form">
    <div class="form-group">
      <label>
        Nom *
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
      <label class="desc">
        Description
        <textarea
          type="text"
          maxlength="1500"
          v-model="description"
          placeholder="Description du build"
          class="form-textarea"
        ></textarea>
      </label>
    </div>

    <div class="form-group" v-if="connexionStore.isLoggedIn">
      <label class="visibility-toggle">
        <input type="checkbox" v-model="isVisible" />
        <span class="checkmark"></span>
        Visible
      </label>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-submit">Terminer</button>
    </div>
  </form>
</template>

<style scoped>
.build-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--gold-lol);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-dark);
  border: 1px solid var(--nox-grey3);
  border-radius: 4px;
  color: var(--text-color);
  font-size: 0.9rem;
  transition: border-color 0.2s;
  margin-top: 10px;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--gold-lol);
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
  border: 2px solid var(--nox-grey3);
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s;
}

.visibility-toggle input[type='checkbox']:checked + .checkmark {
  background-color: var(--gold-lol);
  border-color: var(--gold-lol);
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

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-submit {
  padding: 0.75rem 2rem;
  background: var(--nox-grey3);
  color: var(--gold-lol);
  border: 1px solid var(--gold-lol);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover {
  background: var(--nox-grey2);
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
    width: 100%;
    padding: 0.5rem;
  }
}
</style>
