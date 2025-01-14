<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import version from '@/assets/files/lastVersion.json'
import { useRouter } from 'vue-router'

const router = useRouter()

const urlApiSave = import.meta.env.VITE_URL_API_SAVE
const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()

const name = ref('')
const description = ref('')

const submitForm = async () => {
  const data = {
    name: name.value,
    description: description.value,
    version: version,
    sheet: {
      champion: championStore.$state.selectedChampion,
      runes: runeStore.$state.runesSelection,
      summoners: summonerStore.$state.summonerSelection,
      shards: shardStore.$state.shardsSelection,
      items: itemStore.$state.ItemsSelection,
    },
  }
  const fileName = `${uuidv4()}.json`

  try {
    const response = await fetch(`${urlApiSave}/api/save/${fileName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la sauvegarde')
    }
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
      <div data-v-b6709614="" class="next">
        <button type="submit" data-v-b6709614="">Finish</button>
      </div>
    </form>
  </div>
</template>
