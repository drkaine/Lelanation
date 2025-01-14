<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import type { BuildData } from '@/types/build'
import {
  calculateBaseStats,
  calculateItemStats,
  calculateTotalStats,
} from '@/components/script/BuildCalculator'

const route = useRoute()
const router = useRouter()
const fileName = route.params.fileName as string
const buildData = ref<BuildData | null>(null)
const lvl = ref(1)

const response = await fetch(`/src/assets/build/${fileName}`)
const data = await response.json()
buildData.value = data

const itemsStats = computed(() => {
  if (buildData.value?.sheet.items.stats) {
    return calculateItemStats(buildData.value.sheet.items.stats)
  }
  return {
    armor: 0,
    attackdamage: 0,
    attackrange: 0,
    attackspeed: 0,
    crit: 0,
    hp: 0,
    hpregen: 0,
    movespeed: 0,
    mp: 0,
    mpregen: 0,
    spellblock: 0,
    CDR: 0,
    AP: 0,
    lethality: 0,
    magicPenetration: 0,
    tenacity: 0,
    omnivamp: 0,
    shield: 0,
    spellvamp: 0,
    armorpen: 0,
    magicpen: 0,
  }
})
const championStats = computed(() => {
  if (buildData.value?.sheet.champion.stats) {
    return calculateBaseStats(buildData.value.sheet.champion.stats, lvl.value)
  }
  return {
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
    CDR: 0,
    AP: 0,
    lethality: 0,
    magicPenetration: 0,
    tenacity: 0,
    omnivamp: 0,
    shield: 0,
    spellvamp: 0,
    armorpen: 0,
    magicpen: 0,
  }
})

const totalStats = computed(() =>
  calculateTotalStats(championStats.value, itemsStats.value),
)

async function deleteBuild() {
  try {
    const response = await fetch(`/api/delete/${fileName}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')

    router.push('/build')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

function editBuild() {
  router.push({
    path: '/build/edit',
    query: { file: fileName },
  })
}

const updateLevel = (newLevel: number) => {
  lvl.value = newLevel
}
</script>

<template>
  <main data-v-0c81bdb5="" class="main builds">
    <div data-v-6a3673aa="" data-v-0c81bdb5="" class="build">
      <h1 data-v-6a3673aa="" class="pagetitle">Build</h1>
      <div data-v-6a3673aa="" class="wrap">
        <div data-v-6a3673aa="" class="sheet">
          <div data-v-6a3673aa="" class="el">
            <SheetBuild
              v-if="buildData"
              :version="buildData.version"
              :name="buildData.name"
              :description="buildData.description"
              :champion="buildData.sheet.champion"
              :runes="buildData.sheet.runes"
              :summonners="buildData.sheet.summoners"
              :shards="buildData.sheet.shards"
              :items="buildData.sheet.items"
            />
          </div>
        </div>
        <div data-v-6a3673aa="" class="actions">
          <div data-v-6a3673aa="" class="image">
            <button data-v-6a3673aa="" class="btn small sea">
              <svg
                data-v-6a3673aa=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 8h.01"></path>
                <path
                  d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
                ></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4"></path>
                <path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559"></path>
                <path d="M19 16v6"></path>
                <path d="M22 19l-3 3l-3 -3"></path>
              </svg>
              Télécharger l'image
            </button>
            <button
              data-v-6a3673aa=""
              class="btn small sea"
              title="Copy to clipboard"
            >
              <svg
                data-v-6a3673aa=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 8h.01"></path>
                <path
                  d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7"
                ></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3"></path>
                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0"></path>
                <path d="M20 21l2 -2l-2 -2"></path>
                <path d="M17 17l-2 2l2 2"></path>
              </svg>
              Copier l'image
            </button>
            <button
              data-v-6a3673aa=""
              class="btn small sea"
              title="Copy to clipboard"
            >
              <svg
                data-v-6a3673aa=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 8h.01"></path>
                <path
                  d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7"
                ></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3"></path>
                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0"></path>
                <path d="M20 21l2 -2l-2 -2"></path>
                <path d="M17 17l-2 2l2 2"></path>
              </svg>
              Télécharger le JSON
            </button>
          </div>
          <div data-v-6a3673aa="" class="rest">
            <!-- <button data-v-6a3673aa="" class="btn small slate">Duplicate</button> -->
            <button
              data-v-6a3673aa=""
              class="btn small slate"
              @click="deleteBuild"
            >
              Supprimer
            </button>
            <button
              data-v-6a3673aa=""
              class="btn small slate"
              @click="editBuild"
            >
              Modifier
            </button>
          </div>
        </div>
        <div data-v-6a3673aa="" class="stats">
          <div data-v-636d16e0="" data-v-6a3673aa="" class="stats">
            <div data-v-636d16e0="" class="list">
              <div data-v-636d16e0="" class="labels">
                <div data-v-636d16e0="" class="label column">base</div>
                <div data-v-636d16e0="" class="label column">items</div>
                <div data-v-636d16e0="" class="label column">total</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.hp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.hp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.hp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">HP</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.hpregen
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.hpregen }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.hpregen }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">HP regen</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.mp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.mp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.mp }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Mana</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.mpregen
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.mpregen }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.mpregen }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Mana regen</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.armor
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.armor }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.armor }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Armure</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.spellblock
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.spellblock
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.spellblock
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Resistance magique</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.attackdamage
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.attackdamage
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.attackdamage
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">AD</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.movespeed
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.movespeed
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.movespeed
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Vitesse de déplacement
                </div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.attackrange
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.attackrange
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.attackrange
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Portée d'attaque</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ championStats.attackspeed
                  }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.attackspeed }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.attackspeed }}<span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">Vitesse d'attaque (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.CDR }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.CDR }}
                  <span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">CDR</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.AP }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.AP }}
                  <span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">AP</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.lethality
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.lethality }}
                  <span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Lethalité</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.magicPenetration
                  }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.magicPenetration }}
                  <span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Pénétration magique (%)
                </div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.shield }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.shield }}
                  <span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Augmentation bouclier (%)
                </div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.omnivamp }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.omnivamp }}
                  <span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">Omnivamp (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.crit }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.crit }}
                  <span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">Critique (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ itemsStats.tenacity }}<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.tenacity }}
                  <span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">ténacité (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  {{ buildData?.sheet.items.gold.total
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  {{ buildData?.sheet.items.gold.total
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Gold</div>
              </div>
            </div>

            <div data-v-636d16e0="" class="list">
              <div data-v-636d16e0="" class="labels">
                <div data-v-636d16e0="" class="label column">Réduction</div>
                <div data-v-636d16e0="" class="label column">Effectif</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                ></div>
                <div
                  data-v-636d16e0=""
                  class="health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveAttackSpeed
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Vitesse d'attaque (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveArmor.damageReduction
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveArmor.effectiveHealth
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Armure</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveEffectiveMR.damageReduction
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveEffectiveMR.effectiveHealth
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">Résistance magique</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                ></div>
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ totalStats.EffectiveMovementSpeed
                  }}<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Vitesse de déplacement
                </div>
              </div>
            </div>

            <!-- <div data-v-636d16e0="" class="slot">
              <div data-v-5f37b7fd="" data-v-6a3673aa="" class="note">
                <div data-v-cbff5ddf="" data-v-5f37b7fd="" class="tooltip">
                  <svg
                    data-v-5f37b7fd=""
                    data-v-cbff5ddf-s=""
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                    <path d="M12 9h.01"></path>
                    <path d="M11 12h1v4h1"></path>
                  </svg>
                  <div
                    data-v-cbff5ddf=""
                    class="touch box"
                    style="position: absolute; left: -45px; top: -101px"
                  >
                    <div data-v-cbff5ddf="" class="body">
                      <b data-v-5f37b7fd="" data-v-cbff5ddf-s=""
                        >Combined base and item stats</b
                      ><br data-v-5f37b7fd="" data-v-cbff5ddf-s="" />
                      Item percentage is calculated into the stat,<br
                        data-v-5f37b7fd=""
                        data-v-cbff5ddf-s=""
                      />
                      unless the percentage stat is shown in the table.<br
                        data-v-5f37b7fd=""
                        data-v-cbff5ddf-s=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
          <div data-v-6a3673aa="" class="levels">
            <div
              data-v-575fc9df=""
              data-v-6a3673aa=""
              class="levels horizontal"
              title="level"
            >
              <button
                v-for="level in 18"
                data-v-575fc9df=""
                :key="level"
                :class="['level', { active: lvl === level }]"
                @click="updateLevel(level)"
              >
                {{ level }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
