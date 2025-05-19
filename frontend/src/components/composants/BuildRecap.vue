<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
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
import StatistiquesBuild from '@/components/composants/StatistiquesBuild.vue'

const connexionStore = useConnexionStore()
const route = useRoute()
const router = useRouter()
const buildStore = useBuildStore()
const type = route.params.type as string | undefined
const fileName = route.params.fileName as string
const apiUrl =
  type === 'lelariva'
    ? `/api/build/lelariva/${fileName}`
    : `/api/build/${fileName}`
const buildData = ref<BuildData | null>(null)
const isAdmin = computed(
  () => connexionStore.userName === import.meta.env.VITE_NAME,
)

const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
const roleStore = useRoleStore()

let response = await fetch(apiUrl)

let lelarivaBuild = false

if (!response.ok) {
  response = await fetch(`/api/build/${fileName}`)
  lelarivaBuild = true
}

const data = await response.json()

buildData.value = data

async function deleteBuild() {
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')
    buildStore.removeBuild(fileName)
    router.push('/build')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
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
  championStore.setChampionSkillsOrder(buildData.value.sheet.skillOrder)
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
  <main class="build-recap" role="main">
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
              <span>{{ $t('build-recap.json') }}</span>
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
              <span>{{ $t('build-recap.image') }}</span>
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
              <span>{{ $t('build-recap.image') }}</span>
            </button>
          </div>

          <div
            class="edit-actions"
            v-if="
              (lelarivaBuild && isAdmin) ||
              (!lelarivaBuild &&
                buildStore.userBuilds.some(
                  (build: BuildData) => build.id === buildData?.id,
                ))
            "
          >
            <button class="btn edit" @click="editBuild">
              {{ $t('build-recap.edit') }}
            </button>
            <button class="btn delete" @click="deleteBuild">
              {{ $t('build-recap.delete') }}
            </button>
          </div>
        </div>

        <section class="sheet-section">
          <div class="sheet">
            <SheetBuild
              v-if="buildData"
              :version="buildData.version"
              :name="buildData.name"
              :author="null"
              :description="buildData.description"
              :champion="buildData.sheet.champion"
              :runes="buildData.sheet.runes"
              :summoners="buildData.sheet.summoners"
              :shards="buildData.sheet.shards"
              :items="buildData.sheet.items"
              :roles="buildData.roles"
              :skillOrder="buildData.sheet.skillOrder"
              :certified="buildData.certified"
              :buildId="fileName"
              :isLelarivaBuild="lelarivaBuild"
              @certification-toggled="
                buildData.certified = !buildData.certified
              "
            />
          </div>
        </section>
      </div>

      <section class="stats-section" v-if="buildData">
        <StatistiquesBuild
          :build="buildData.buildStats"
          :total="buildData.sheet.items.gold.total"
        />
      </section>
    </div>
  </main>
</template>

<style scoped>
main[role='main'] {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.build-recap {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.build-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  font-weight: bold;
}

.level-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-selector select {
  border: var(--border-size) solid var(--color-gold-300);
  color: var(--color-gold-500);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: var(--text-base);
}

.build-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
  width: 100%;
}

.sheet-section {
  position: sticky;
  top: 2rem;
  width: 100%;
  max-width: 800px;
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
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.edit-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-grey-300);
  width: 100%;
  flex-wrap: wrap;
}

.certification-actions {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--color-gold-300);
  width: 100%;
  justify-content: center;
}

.btn.certification {
  background-color: var(--color-gold-300);
  color: var(--color-grey-800);
  font-weight: bold;
  font-size: 1.1em;
  padding: 0.6em 1em;
  border: 2px solid var(--color-gold-400);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-width: 120px !important;
}

.btn.certification:hover {
  background-color: var(--color-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 500px) {
  .sheet-container {
    padding: 10px;
  }
}

@media (max-width: 1024px) {
  .build-content {
    grid-template-columns: 1fr;
  }

  .sheet-section {
    position: static;
    margin: 0 auto;
  }

  .actions-panel {
    justify-content: center;
  }

  .level-buttons {
    grid-template-columns: repeat(9, 30px);
    grid-template-rows: repeat(2, 30px);
  }
}

@media (max-width: 768px) {
  .build-recap {
    padding: 1rem;
  }

  .sheet-section {
    max-width: 100%;
  }

  .build-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions-panel {
    margin-right: -10px;
  }

  .stats-table {
    font-size: var(--text-sm);
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
    font-size: var(--text-xs);
  }

  .btn span {
    display: none;
  }

  .btn {
    padding: 0.5em;
    aspect-ratio: 1;
    min-width: 30px !important;
    height: 30px;
  }

  .btn.certification {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: auto;
    aspect-ratio: auto;
    padding: 0.6em 1em;
    min-width: 100px !important;
  }

  .btn.certification span {
    display: inline;
  }

  .edit-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .certification-actions {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
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

.tabs-container {
  width: 100%;
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

.stats-section {
  max-width: 800px;
  margin: 0 auto;
}
</style>
