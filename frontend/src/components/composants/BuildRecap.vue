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
import type { Stats } from '@/types/stat'

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
    const sheetElement = document.querySelector(
      '.sheet-section .sheet',
    ) as HTMLElement
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
    const sheetElement = document.querySelector(
      '.sheet-section .sheet',
    ) as HTMLElement
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

const statTranslations: Record<string, string> = {
  hp: 'HP',
  hpregen: 'HP Regen',
  mp: 'Mana',
  mpregen: 'Mana Regen',
  armor: 'Armure',
  spellblock: 'Résistance magique',
  attackdamage: 'AD',
  movespeed: 'Vitesse de déplacement (%)',
  attackrange: "Portée d'attaque",
  attackspeed: "Vitesse d'attaque",
  CDR: 'CDR',
  AP: 'AP',
  lethality: 'Léthalité',
  crit: 'Chance de critique (%)',
  magicPenetration: 'Pénétration magique',
  shield: 'Augmentation bouclier',
  omnivamp: 'Omnivamp (%)',
  tenacity: 'Tenacité (%)',
}

const statsList = [
  'hp',
  'hpregen',
  'mp',
  'mpregen',
  'armor',
  'spellblock',
  'attackdamage',
  'movespeed',
  'attackrange',
  'attackspeed',
  'CDR',
  'AP',
  'lethality',
  'crit',
  'magicPenetration',
  'shield',
  'omnivamp',
  'tenacity',
]
</script>

<template>
  <main class="build-recap">
    <h1 class="page-title">Build</h1>

    <div class="build-content">
      <div class="left-column">
        <div class="actions-panel">
          <div class="action-buttons">
            <button class="btn" @click="downloadJson">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
              >
                <path
                  d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"
                />
                <path
                  d="M12 15h-1c-.5 0-1 .5-1 1s.5 1 1 1h1c.5 0 1-.5 1-1s-.5-1-1-1z"
                />
                <path d="M19 16v6" />
                <path d="M22 19l-3 3l-3 -3" />
                <path d="M4 11h.01" />
                <path d="M4 15h.01" />
                <path d="M8 11h.01" />
                <path d="M8 15h.01" />
              </svg>
              JSON
            </button>
            <button class="btn" @click="downloadImage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
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
              Image
            </button>
            <button class="btn" @click="copyImageToClipboard">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
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
              Image
            </button>
          </div>

          <div
            class="edit-actions"
            v-if="
              !fileName.startsWith('lelariva_') || connexionStore.isLoggedIn
            "
          >
            <button class="btn edit" @click="editBuild">Modifier</button>
            <button class="btn delete" @click="deleteBuild">Supprimer</button>
          </div>
        </div>

        <section class="sheet-section">
          <div class="sheet">
            <SheetBuild
              v-if="buildData"
              :version="buildData.version"
              :name="buildData.name"
              :description="buildData.description"
              :champion="buildData.sheet.champion"
              :runes="buildData.sheet.runes"
              :summoners="buildData.sheet.summoners"
              :shards="buildData.sheet.shards"
              :items="buildData.sheet.items"
              :roles="buildData.roles"
            />
          </div>
        </section>
      </div>

      <section class="info-section">
        <div class="stats-panel">
          <table class="stats-table">
            <thead>
              <tr>
                <th>Statistique</th>
                <th>Base</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in statsList" :key="stat">
                <td>{{ statTranslations[stat] }}</td>
                <td>
                  {{
                    buildData?.buildStats.baseStats[lvl - 1][
                      stat as keyof Stats
                    ]
                  }}
                </td>
                <td>
                  {{
                    buildData?.buildStats.buildItemStats[stat as keyof Stats]
                  }}
                </td>
                <td>
                  {{
                    buildData?.buildStats.totalStats[lvl - 1][
                      stat as keyof Stats
                    ]
                  }}
                </td>
              </tr>
              <tr>
                <td>Or</td>
                <td>0</td>
                <td>{{ buildData?.sheet.items.gold.total }}</td>
                <td>{{ buildData?.sheet.items.gold.total }}</td>
              </tr>
            </tbody>
          </table>
          <div class="level-selector">
            <div class="level-buttons">
              <button
                v-for="n in 18"
                :key="n"
                :class="['level-btn', { active: lvl === n }]"
                @click="updateLevel(n)"
              >
                {{ n }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.build-recap {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.build-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: var(--color-gold-300);
  font-size: 2rem;
  font-weight: bold;
}

.level-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-selector select {
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--sand-2);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 1rem;
}

.build-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.sheet-section {
  background: transparent;
  border-radius: 8px;
  padding: 0;
  width: fit-content;
  margin: 0;
}

.sheet-section .sheet {
  background: transparent;
  padding: 0;
  margin: 0;
  width: fit-content;
  display: inline-block;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.actions-panel {
  border-radius: 8px;
  padding: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--color-gold-300);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: var(--width-all);
}

.edit-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--slate-3);
}

.stats-panel {
  border-radius: 8px;
  padding: 1rem;
}

.stats-table {
  border-collapse: collapse;
  margin-bottom: 0;
  border-bottom: 1px solid var(--slate-3);
}

.stats-table th,
.stats-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--slate-3);
}

.stats-table th {
  color: var(--color-gold-300);
  font-weight: bold;
}

.stats-table td {
  color: var(--sand-2);
}

.level-selector {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--slate-3);
  margin-top: -1px;
}

.level-buttons {
  display: grid;
  grid-template-columns: repeat(18, 30px);
  gap: 0.5rem;
  justify-content: center;
}

.level-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border: var(--border-size) solid transparent;
  color: var(--sand-2);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-btn:hover {
  border-color: var(--color-gold-300);
}

.level-btn.active {
  border-color: var(--color-gold-300);
  color: var(--color-gold-300);
  font-weight: bold;
}

@media (max-width: 1024px) {
  .build-content {
    grid-template-columns: 1fr;
  }

  .build-recap {
    padding: 1rem;
  }

  .level-buttons {
    grid-template-columns: repeat(9, 30px);
    grid-template-rows: repeat(2, 30px);
  }
}

@media (max-width: 768px) {
  .build-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions-panel {
    margin-right: -10px;
  }

  .stats-table {
    font-size: 0.9rem;
  }

  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
  }

  .level-buttons {
    grid-template-columns: repeat(6, 25px);
    grid-template-rows: repeat(3, 25px);
  }

  .level-btn {
    width: 25px;
    height: 25px;
    font-size: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .build-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: start;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .build-content {
    grid-template-columns: 1fr;
  }

  .left-column {
    width: var(--width-all);
  }

  .actions-panel {
    width: var(--width-all);
  }
}
</style>
