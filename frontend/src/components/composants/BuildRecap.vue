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
  <main class="main builds">
    <div class="build">
      <h1 class="pagetitle">Build</h1>
      <div class="wrap">
        <div class="sheet">
          <div class="el">
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
        <div class="actions">
          <div class="image">
            <button class="btn small sea" @click="downloadImage">
              <svg
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
              class="btn small sea"
              title="Copy to clipboard"
              @click="copyImageToClipboard"
            >
              <svg
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
              class="btn small sea"
              title="Copy to clipboard"
              @click="downloadJson"
            >
              <svg
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
          <div class="rest">
            <!-- <button  class="btn small slate">Duplicate</button> -->
            <button
              class="btn small slate"
              v-if="
                !fileName.startsWith('lelariva_') || connexionStore.isLoggedIn
              "
              @click="deleteBuild"
            >
              Supprimer
            </button>
            <button
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
        <div class="stats">
          <div class="stats">
            <div class="list">
              <div class="labels">
                <div class="label column">base</div>
                <div class="label column">items</div>
                <div class="label column">total</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">HP</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">HP regen</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Mana</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Mana regen</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Armure</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Resistance magique</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">AD</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Vitesse de déplacement</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Portée d'attaque</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div class="name">Vitesse d'attaque (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  <span>&nbsp;</span>
                </div>
                <div class="name">CDR</div>
              </div>
              <div class="list-item">
                <div
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  <span>&nbsp;</span>
                </div>
                <div class="name">AP</div>
              </div>
              <div class="list-item">
                <div
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  <span>&nbsp;</span>
                </div>
                <div class="name">Lethalité</div>
              </div>
              <div class="list-item">
                <div
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  <span>%</span>
                </div>
                <div class="name">Pénétration magique (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  <span>%</span>
                </div>
                <div class="name">Augmentation bouclier (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  <span>%</span>
                </div>
                <div class="name">Omnivamp (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>%</span>
                </div>
                <div
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  {{ buildData?.buildStats.buildItemStats.crit }}<span>%</span>
                </div>
                <div
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
                  <span>%</span>
                </div>
                <div class="name">Critique (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span>%</span>
                </div>
                <div
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
                  }}<span>%</span>
                </div>
                <div
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
                  <span>%</span>
                </div>
                <div class="name">ténacité (%)</div>
              </div>
              <div class="list-item">
                <div
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  0<span>&nbsp;</span>
                </div>
                <div
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  {{ buildData?.sheet.items.gold.total }}<span>&nbsp;</span>
                </div>
                <div
                  class="gold value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--green), var(--red) 50%) 0%
                    );
                  "
                >
                  {{ buildData?.sheet.items.gold.total }}<span>&nbsp;</span>
                </div>
                <div class="name">Gold</div>
              </div>
            </div>

            <div class="list">
              <div class="labels">
                <div class="label column">Réduction</div>
                <div class="label column">Effectif</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Vitesse d'attaque (%)</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Armure</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Résistance magique</div>
              </div>
              <div class="list-item">
                <div
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
                  }}<span>&nbsp;</span>
                </div>
                <div class="name">Vitesse de déplacement</div>
              </div>
            </div>

            <!-- <div  class="slot">
              <div   class="note">
                <div   class="tooltip">
                  <svg
                    
                    "
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
                    
                    class="touch box"
                    style="position: absolute; left: -45px; top: -101px"
                  >
                    <div  class="body">
                      <b  "
                        >Combined base and item stats</b
                      ><br  " />
                      Item percentage is calculated into the stat,<br
                        
                        "
                      />
                      unless the percentage stat is shown in the table.<br
                        
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
          <div class="levels">
            <div class="levels horizontal" title="level">
              <button
                v-for="level in 18"
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
