<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const urlApiSave = import.meta.env.URL_API_SAVE

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
    sheet: {
      champion: championStore.$state,
      rune: runeStore.$state,
      shard: summonerStore.$state,
      item: shardStore.$state,
      summoner: itemStore.$state,
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
  } catch (error) {
    console.error('Erreur:', error)
  }
}
</script>

<template>
  <!-- <div data-v-b6709614="" >
    <div data-v-63d61340="" data-v-6a781413="" >
      <div data-v-6a781413="" class="extra-stats">
        <div data-v-636d16e0="" data-v-6a781413="" class="stats" v-if="championStore.selectedChampion?.stats">
          <div data-v-636d16e0="" class="list">
            <table>
              <thead>
                <tr>
                  <th style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    niveau
                  </th>
                  <th>0</th>
                  <th v-for="n in 18" :key="n" class="list-item" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{ n }}
                  </th>
                  <th style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Par level
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    PV
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.hp }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.hp +
                        championStore.selectedChampion?.stats.hpperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.hp +
                          championStore.selectedChampion?.stats.hpperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.hp +
                        championStore.selectedChampion?.stats.hpperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.hpperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    PV régen
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.hpregen }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.hpregen +
                        championStore.selectedChampion?.stats.hpregenperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.hpregen +
                          championStore.selectedChampion?.stats.hpregenperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.hpregen +
                        championStore.selectedChampion?.stats.hpregenperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.hpregenperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Mana
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.mp }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.mp +
                        championStore.selectedChampion?.stats.mpperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.mp +
                          championStore.selectedChampion?.stats.mpperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.mp +
                        championStore.selectedChampion?.stats.mpperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.mpperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Mana régen
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.mpregen }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.mpregen +
                        championStore.selectedChampion?.stats.mpregenperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.mpregen +
                          championStore.selectedChampion?.stats.mpregenperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.mpregen +
                        championStore.selectedChampion?.stats.mpregenperlevel * n
                    }}
                  </td>
                    <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.mpregenperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Armure
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.armor }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.armor +
                        championStore.selectedChampion?.stats.armorperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.armor +
                          championStore.selectedChampion?.stats.armorperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.armor +
                        championStore.selectedChampion?.stats.armorperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.armorperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Résistance
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.spellblock }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.spellblock +
                        championStore.selectedChampion?.stats.spellblockperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.spellblock +
                          championStore.selectedChampion?.stats.spellblockperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.spellblock +
                        championStore.selectedChampion?.stats.spellblockperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.spellblockperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    AD
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.attackdamage }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.attackdamage +
                        championStore.selectedChampion?.stats.attackdamageperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.attackdamage +
                          championStore.selectedChampion?.stats.attackdamageperlevel *
                          n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.attackdamage +
                        championStore.selectedChampion?.stats.attackdamageperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.attackdamageperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    AS
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.attackspeed }} %
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.attackspeed +
                        championStore.selectedChampion?.stats.attackspeedperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.attackspeed +
                          championStore.selectedChampion?.stats.attackspeedperlevel *
                          n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.attackspeed +
                        championStore.selectedChampion?.stats.attackspeedperlevel * n
                    }} %
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    {{ championStore.selectedChampion?.stats.attackspeedperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    MS
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.movespeed }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (championStore.selectedChampion?.stats.movespeed)
                        .toString()
                        .includes('.')
                        ? (championStore.selectedChampion?.stats.movespeed).toFixed(2)
                        : championStore.selectedChampion?.stats.movespeed
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                    0
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Critique
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.crit }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (
                        championStore.selectedChampion?.stats.crit +
                        championStore.selectedChampion?.stats.critperlevel * n
                      )
                        .toString()
                        .includes('.')
                        ? (
                          championStore.selectedChampion?.stats.crit +
                          championStore.selectedChampion?.stats.critperlevel * n
                        ).toFixed(2)
                        : championStore.selectedChampion?.stats.crit +
                        championStore.selectedChampion?.stats.critperlevel * n
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                      {{ championStore.selectedChampion?.stats.critperlevel }}
                  </td>
                </tr>
                <tr>
                  <td style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            " class="health value column">
                    Range
                  </td>
                  <td class="list-item">
                    {{ championStore.selectedChampion?.stats.attackrange }}
                  </td>
                  <td v-for="n in 18" :key="n" :style="n % 2 !== 0
                    ? {
                      color: 'var(--slate-6)',
                      background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                    }
                    : {}
                    ">
                    {{
                      (championStore.selectedChampion?.stats.attackrange)
                        .toString()
                        .includes('.')
                        ? (championStore.selectedChampion?.stats.attackrange).toFixed(2)
                        : championStore.selectedChampion?.stats.attackrange
                    }}
                  </td>
                  <td class="list-item" style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            ">
                      0
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </div> -->
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
