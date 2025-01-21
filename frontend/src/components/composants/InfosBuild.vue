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
    fileName = connexionStore.isLoggedIn ? `lelariva_` + fileName : fileName
    fileName = isVisible.value ? fileName : 'wait_' + fileName
  }

  const data = {
    id: fileName,
    roles: Array.from(roleStore.selectedRoles),
    name: name.value,
    description: description.value,
    version: version,
    visible: connexionStore.isLoggedIn ? isVisible.value : false,
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
  <div data-v-af89f54e="" data-v-b6709614="" class="info">
    <form data-v-af89f54e="" @submit.prevent="submitForm">
      <label data-v-af89f54e="">
        Name *
        <input
          data-v-af89f54e=""
          maxlength="58"
          type="text"
          required
          v-model="name"
        />
      </label>
      <label data-v-af89f54e="" class="desc">
        Description
        <textarea
          data-v-af89f54e=""
          type="text"
          maxlength="1500"
          v-model="description"
        >
        </textarea>
      </label>
      <label v-if="connexionStore.isLoggedIn" class="visibility-toggle">
        <input type="checkbox" v-model="isVisible" />
        <span class="checkmark"></span>
        Visible
      </label>
      <div data-v-b6709614="" class="next">
        <button type="submit" data-v-b6709614="">Finish</button>
      </div>
    </form>
  </div>
</template>
