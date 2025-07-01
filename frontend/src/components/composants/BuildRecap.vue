<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()
const connexionStore = useConnexionStore()
const route = useRoute()
const router = useRouter()
const buildStore = useBuildStore()
const type = route.params.type as string | undefined
const rawFileName = route.params.fileName as string
const fileName = rawFileName.endsWith('.json')
  ? rawFileName.slice(0, -5)
  : rawFileName
const apiUrl =
  type === 'lelariva'
    ? `/api/build/lelariva/${fileName}`
    : `/api/build/${fileName}`
const buildData = ref<BuildData | null>(null)
const isAdmin = computed(
  () => connexionStore.userName === import.meta.env.VITE_NAME,
)

const showNotification = ref(false)
const notificationMessage = ref('')

const championStore = useChampionStore()
const runeStore = useRuneStore()
const summonerStore = useSummonerStore()
const shardStore = useShardStore()
const itemStore = useItemStore()
const roleStore = useRoleStore()

let response = await fetch(apiUrl)

let lelarivaBuild = type === 'lelariva' && response.ok

if (!response.ok) {
  response = await fetch(`/api/build/${fileName}`)
  lelarivaBuild = false
}

const data = await response.json()

buildData.value = data

if (buildData.value?.sheet) {
  const recalculatedBuild = buildStore.statsCalculatorWithShards(
    buildData.value.sheet.champion.stats,
    buildData.value.sheet.items.stats,
    buildData.value.sheet.champion,
    buildData.value.sheet.shards,
  )
  buildData.value.buildStats = recalculatedBuild
}

async function deleteBuild() {
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')

    const buildId = buildData.value?.id || fileName
    buildStore.removeBuild(buildId)

    window.dispatchEvent(
      new CustomEvent('buildDeleted', {
        detail: { buildId },
      }),
    )

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

function generateShareMessage() {
  if (!buildData.value) return ''

  const currentUrl = window.location.href
  const championName = buildData.value.sheet.champion.name
  const description = buildData.value.description || ''
  const version = buildData.value.version || t('build-recap.no-version')
  const certified = buildData.value.certified || false
  const author = buildData.value.author || t('build-recap.no-author')
  const roles = buildData.value.roles.join(', ') || t('build-recap.all-roles')

  let messageTemplate = ''

  if (type === 'lelariva') {
    messageTemplate = t('build-recap.share-message-lelariva')
  } else if (certified) {
    messageTemplate = t('build-recap.share-message-user-certified')
  } else {
    messageTemplate = t('build-recap.share-message-user')
  }

  return messageTemplate
    .replace('{champion}', championName)
    .replace('{author}', author)
    .replace('{description}', description)
    .replace('{version}', version)
    .replace('{url}', currentUrl)
    .replace('{roles}', roles)
}

async function copyShareMessage() {
  try {
    const message = generateShareMessage()
    await navigator.clipboard.writeText(message)
    notificationMessage.value = t('build-recap.share-copied')

    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  } catch (error) {
    console.error('Erreur lors de la copie du message:', error)
    notificationMessage.value = 'Erreur lors de la copie'
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}

async function shareToDiscordApp() {
  try {
    const message = generateShareMessage()

    await navigator.clipboard.writeText(message)

    const discordAppUrl = `discord://`
    window.open(discordAppUrl, '_blank')

    setTimeout(() => {
      const discordWebUrl = `https://discord.com/app`
      window.open(discordWebUrl, '_blank')
    }, 1500)

    notificationMessage.value = t('build-recap.share-discord-app-opened')
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 4000)
  } catch (error) {
    console.error("Erreur lors de l'ouverture de Discord:", error)
    notificationMessage.value = "Erreur lors de l'ouverture de Discord"
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}

async function shareToX() {
  try {
    const message = generateShareMessage()

    const encodedMessage = encodeURIComponent(message)

    const xUrl = `https://x.com/intent/tweet?text=${encodedMessage}`
    window.open(xUrl, '_blank')

    notificationMessage.value = t('build-recap.share-x-opened')
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 4000)
  } catch (error) {
    console.error("Erreur lors de l'ouverture de X:", error)
    notificationMessage.value = "Erreur lors de l'ouverture de X"
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  }
}

// async function shareToDiscord() {
//   try {
//     const message = generateShareMessage()

//     const response = await fetch('/api/discord/share', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message })
//     })

//     const result = await response.json()

//     if (!response.ok) {
//       throw new Error(result.error || 'Erreur inconnue')
//     }

//     notificationMessage.value = t('build-recap.share-discord-success')
//     showNotification.value = true
//     setTimeout(() => {
//       showNotification.value = false
//     }, 3000)
//   } catch (error) {
//     console.error('Erreur lors du partage Discord:', error)
//     notificationMessage.value = t('build-recap.share-discord-error')
//     showNotification.value = true
//     setTimeout(() => {
//       showNotification.value = false
//     }, 3000)
//   }
// }
</script>

<template>
  <main class="build-recap" role="main">
    <h1 class="page-title">Build</h1>

    <div v-if="showNotification" class="notification-toast">
      {{ notificationMessage }}
    </div>

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
            <button class="btn" @click="copyShareMessage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
              >
                <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                <path d="M8.7 10.7l6.6 -3.4"></path>
                <path d="M8.7 13.3l6.6 3.4"></path>
              </svg>
              <span>{{ $t('build-recap.share') }}</span>
            </button>
            <button class="btn discord" @click="shareToDiscordApp">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
                />
              </svg>
              <span>{{ $t('build-recap.share-discord-app') }}</span>
            </button>
            <button class="btn x-twitter" @click="shareToX">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              <span>{{ $t('build-recap.share-x') }}</span>
            </button>
            <!-- <button class="btn discord" @click="shareToDiscord">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.196.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>{{ $t('build-recap.share-discord') }}</span>
            </button> -->
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
              @certification-toggled="buildData.certified = $event"
            />
          </div>
        </section>
      </div>

      <section class="stats-section" v-if="buildData">
        <StatistiquesBuild
          :build="buildData.buildStats"
          :total="buildData.sheet.items.gold.total"
          :shards="buildData.sheet.shards"
          :champion="buildData.sheet.champion"
        />
      </section>
    </div>
  </main>
</template>
