<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import type { BuildData } from '@/types/build'
import { useBuildStore } from '@/stores/buildStore'
import domtoimage from 'dom-to-image-more'
import { useConnexionStore } from '@/stores/connexionStore'
import { useChampionStore } from '@/stores/championStore'
import { useRuneStore } from '@/stores/runeStore'
import { useSummonerStore } from '@/stores/summonerStore'
import { useShardStore } from '@/stores/shardStore'
import { useItemStore } from '@/stores/itemStore'
import { useRoleStore } from '@/stores/roleStore'

const connexionStore = useConnexionStore()
const route = useRoute()
const router = useRouter()
const buildStore = useBuildStore()
const fileName = route.params.fileName as string
const buildData = ref<BuildData | null>(null)
const lvl = ref(1)
const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
const roleStore = useRoleStore()

const response = await fetch(`/api/build/${fileName}`)
const data = await response.json()

buildData.value = data

async function deleteBuild() {
  try {
    const response = await fetch(`/api/build/${fileName}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')
    buildStore.removeBuild(fileName)
    router.push('/build')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const updateLevel = (newLevel: number) => {
  lvl.value = newLevel
}

function downloadJson() {
  if (!buildData.value) return

  const jsonString = JSON.stringify(buildData.value, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })

  const url = window.URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${buildData.value.name}_build.json`

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

async function downloadImage() {
  try {
    const sheetElement = document.querySelector('.sheet') as HTMLElement
    if (!sheetElement) {
      throw new Error('Élément sheet non trouvé')
    }

    const dataUrl = await domtoimage.toPng(sheetElement, {
      quality: 1.0,
      scale: 2,
      bgcolor: '#ffffff',
    })

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${buildData.value?.name ?? 'build'}_sheet.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error)
  }
}

async function copyImageToClipboard() {
  try {
    const sheetElement = document.querySelector('.sheet') as HTMLElement
    if (!sheetElement) {
      throw new Error('Élément sheet non trouvé')
    }

    const dataUrl = await domtoimage.toPng(sheetElement, {
      quality: 1.0,
      scale: 2,
      bgcolor: '#ffffff',
    })

    const response = await fetch(dataUrl)
    const blob = await response.blob()

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ])
  } catch (error) {
    console.error("Erreur lors de la copie de l'image:", error)
  }
}

const editBuild = () => {
  if (!buildData.value) return

  championStore.setSelectedChampion(buildData.value.sheet.champion)
  runeStore.runesSelection = buildData.value.sheet.runes
  summonerStore.summonerSelection = buildData.value.sheet.summoners
  shardStore.shardsSelection = buildData.value.sheet.shards
  itemStore.ItemsSelection = buildData.value.sheet.items
  roleStore.updateSelectedRoles(new Set(buildData.value.roles))

  buildStore.setBuildToEdit(buildData.value)

  router.push('/build')
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
              :roles="buildData.roles ?? null"
            />
          </div>
        </div>
        <div data-v-6a3673aa="" class="actions">
          <div data-v-6a3673aa="" class="image">
            <button
              data-v-6a3673aa=""
              class="btn small sea"
              @click="downloadImage"
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
              @click="copyImageToClipboard"
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
              @click="downloadJson"
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
              v-if="
                !fileName.startsWith('lelariva_') || connexionStore.isLoggedIn
              "
              @click="deleteBuild"
            >
              Supprimer
            </button>
            <button
              data-v-6a3673aa=""
              class="btn small slate"
              v-if="
                !fileName.startsWith('lelariva_') || connexionStore.isLoggedIn
              "
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].hp
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.buildItemStats.hp
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].hp
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].hpregen
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
                  {{ buildData?.buildStats.buildItemStats.hpregen
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].hpregen
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].mp
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
                  {{ buildData?.buildStats.buildItemStats.mp
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].mp
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].mpregen
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
                  {{ buildData?.buildStats.buildItemStats.mpregen
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].mpregen
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].armor
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
                  {{ buildData?.buildStats.buildItemStats.armor
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].armor
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].spellblock
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
                  {{ buildData?.buildStats.buildItemStats.spellblock
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].spellblock
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].attackdamage
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
                  {{ buildData?.buildStats.buildItemStats.attackdamage
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].attackdamage
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].movespeed
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
                  {{ buildData?.buildStats.buildItemStats.movespeed
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].movespeed
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].attackrange
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
                  {{ buildData?.buildStats.buildItemStats.attackrange
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].attackrange
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
                  {{ buildData?.buildStats.baseStats[lvl - 1].attackspeed
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
                  {{ buildData?.buildStats.buildItemStats.attackspeed
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].attackspeed
                  }}<span data-v-636d16e0="">%</span>
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
                  {{ buildData?.buildStats.buildItemStats.CDR
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].CDR }}
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
                  {{ buildData?.buildStats.buildItemStats.AP
                  }}<span data-v-636d16e0="">&nbsp;</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].AP }}
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
                  {{ buildData?.buildStats.buildItemStats.lethality
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].lethality }}
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
                  {{ buildData?.buildStats.buildItemStats.magicPenetration
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1].magicPenetration
                  }}
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
                  {{ buildData?.buildStats.buildItemStats.shield
                  }}<span data-v-636d16e0="">%</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].shield }}
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
                  {{ buildData?.buildStats.buildItemStats.omnivamp
                  }}<span data-v-636d16e0="">%</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].omnivamp }}
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
                  {{ buildData?.buildStats.buildItemStats.crit
                  }}<span data-v-636d16e0="">%</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].crit }}
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
                  {{ buildData?.buildStats.buildItemStats.tenacity
                  }}<span data-v-636d16e0="">%</span>
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].tenacity }}
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
                  {{ buildData?.buildStats.totalStats[lvl - 1].effectiveAS
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1].effectiveArmor
                      .damageReduction
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1].effectiveArmor
                      .effectiveHealth
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1].effectiveMR
                      .damageReduction
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1].effectiveMR
                      .effectiveHealth
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
                  {{
                    buildData?.buildStats.totalStats[lvl - 1]
                      .effectiveMovementSpeed
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
