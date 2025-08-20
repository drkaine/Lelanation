<script lang="ts">
import { type ChannelInfo } from '@/types/video'
import AnalyticsTab from '@/components/Admin/AnalyticsTab.vue'
import BuildsTab from '@/components/Admin/BuildsTab.vue'
import TierListTab from '@/components/Admin/TierListTab.vue'
import DictionnaireTab from '@/components/Admin/DictionnaireTab.vue'
import ContactTab from '@/components/Admin/ContactTab.vue'

interface ChannelStats {
  name: string
  videoCount: number
  subscriberCount: number
  viewCount: number
}

export default {
  name: 'AdminView',
  components: {
    AnalyticsTab,
    BuildsTab,
    TierListTab,
    DictionnaireTab,
    ContactTab,
  },
  data() {
    return {
      activeTab: 'analytics',
      tabs: [
        { id: 'analytics', name: 'Analytiques', icon: '📊' },
        { id: 'builds', name: 'Builds', icon: '⚔️' },
        { id: 'tier-list', name: 'Tier-list', icon: '🏆' },
        { id: 'dictionnaire', name: 'Dictionnaire', icon: '📚' },
        { id: 'contact', name: 'Contact', icon: '📧' },
        { id: 'youtube', name: 'YouTube', icon: '🎬' },
      ],

      channels: [] as ChannelInfo[],
      channelStats: {} as Record<string, ChannelStats>,
      newChannelId: '',
      loading: false,
      error: null as string | null,
      success: null as string | null,
    }
  },
  methods: {
    async loadChannels(): Promise<void> {
      this.loading = true
      try {
        const response = await fetch('/api/youtube/channels')
        if (!response.ok) {
          throw new Error(this.$t('youtube.error-loading-channels'))
        }
        this.channels = await response.json()

        await this.loadChannelStats()
      } catch (err) {
        this.error = this.$t('youtube.error-loading-channels')
        console.error('Erreur détaillée:', err)
      } finally {
        this.loading = false
      }
    },

    async loadChannelStats(): Promise<void> {
      for (const channel of this.channels) {
        try {
          const response = await fetch(
            `/api/youtube/channels/${channel.channelId}/stats`,
          )
          if (response.ok) {
            const stats = await response.json()
            this.channelStats[channel.channelId] = stats
          }
        } catch (error) {
          console.error(
            `Error loading stats for channel ${channel.channelId}:`,
            error,
          )
        }
      }
    },

    async addChannel(): Promise<void> {
      if (!this.newChannelId.trim()) {
        this.error = this.$t('youtube.please-enter-channel-id')
        return
      }

      this.loading = true
      this.error = null
      this.success = null

      try {
        const response = await fetch('/api/youtube/channels', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ channelId: this.newChannelId.trim() }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || "Erreur lors de l'ajout de la chaîne",
          )
        }

        const result = await response.json()
        this.success = result.message
        this.newChannelId = ''
        await this.loadChannels()
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Erreur lors de l'ajout de la chaîne"
        console.error('Erreur détaillée:', err)
      } finally {
        this.loading = false
      }
    },

    async refreshChannel(channelId: string): Promise<void> {
      this.loading = true
      try {
        const response = await fetch(`/api/youtube/refresh/${channelId}`, {
          method: 'POST',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur lors du rafraîchissement')
        }

        const result = await response.json()
        this.success = `${this.$t('youtube.channel-refreshed')} (${result.videoCount} ${this.$t('youtube.videos-retrieved')})`
        await this.loadChannels()
      } catch (err) {
        this.error =
          err instanceof Error ? err.message : 'Erreur lors du rafraîchissement'
        console.error('Erreur détaillée:', err)
      } finally {
        this.loading = false
      }
    },

    async forceCompleteChannel(channelId: string): Promise<void> {
      if (
        !confirm(
          'Êtes-vous sûr de vouloir forcer la complétion de cette chaîne ? Cela peut prendre du temps et consommer du quota API.',
        )
      ) {
        return
      }

      this.loading = true
      try {
        const response = await fetch(
          `/api/youtube/channels/${channelId}/force-complete`,
          {
            method: 'POST',
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || 'Erreur lors de la complétion forcée',
          )
        }

        const result = await response.json()
        this.success = `${this.$t('youtube.completion-forced')} ! ${result.videosAdded} ${this.$t('youtube.videos-added')}. ${this.$t('youtube.total')}: ${result.totalVideos} ${this.$t('youtube.videos-retrieved')}.`
        await this.loadChannels()
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : 'Erreur lors de la complétion forcée'
        console.error('Erreur détaillée:', err)
      } finally {
        this.loading = false
      }
    },

    formatDate(timestamp: number): string {
      return new Date(timestamp).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    changeTab(tabId: string): void {
      this.activeTab = tabId
      this.error = null
      this.success = null

      if (tabId === 'youtube') {
        this.loadChannels()
      }
    },
  },
  mounted() {
    if (this.activeTab === 'youtube') {
      this.loadChannels()
    }
  },
}
</script>

<template>
  <div class="admin-container">
    <h1 class="page-title">{{ $t('admin.title') }}</h1>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="success" class="success-message">
      {{ success }}
    </div>

    <!-- Onglets de navigation -->
    <div class="tabs-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="changeTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ $t(`admin.${tab.id}`) || tab.name }}
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content">
      <!-- Onglet Analytiques -->
      <div v-if="activeTab === 'analytics'" class="tab-panel">
        <AnalyticsTab />
      </div>

      <!-- Onglet Builds -->
      <div v-else-if="activeTab === 'builds'" class="tab-panel">
        <BuildsTab />
      </div>

      <!-- Onglet Tier-list -->
      <div v-else-if="activeTab === 'tier-list'" class="tab-panel">
        <TierListTab />
      </div>

      <!-- Onglet Dictionnaire -->
      <div v-else-if="activeTab === 'dictionnaire'" class="tab-panel">
        <DictionnaireTab />
      </div>

      <!-- Onglet Contact -->
      <div v-else-if="activeTab === 'contact'" class="tab-panel">
        <ContactTab />
      </div>

      <!-- Onglet YouTube -->
      <div v-else-if="activeTab === 'youtube'" class="tab-panel">
        <!-- Ajout de nouvelle chaîne -->
        <section class="add-channel-section">
          <h2>{{ $t('youtube.add-channel') }}</h2>
          <div class="add-channel-form">
            <input
              v-model="newChannelId"
              type="text"
              :placeholder="$t('youtube.channel-id-placeholder')"
              class="channel-input"
              :disabled="loading"
            />
            <button
              @click="addChannel"
              :disabled="loading || !newChannelId.trim()"
              class="add-button"
            >
              {{ loading ? $t('youtube.adding') : $t('youtube.add') }}
            </button>
          </div>
        </section>

        <!-- Liste des chaînes -->
        <section class="channels-section">
          <h2>{{ $t('youtube.configured-channels') }}</h2>

          <div v-if="loading" class="loading">{{ $t('youtube.loading') }}</div>

          <div v-else-if="channels.length === 0" class="no-channels">
            {{ $t('youtube.no-channels') }}
          </div>

          <div v-else class="channels-list">
            <div
              v-for="channel in channels"
              :key="channel.channelId"
              class="channel-card"
            >
              <div class="channel-info">
                <h3 class="channel-name">
                  {{ channel.channelName }}
                  <span v-if="channel.isComplete" class="complete-badge"
                    >✓</span
                  >
                </h3>
                <p class="channel-id">{{ channel.channelId }}</p>
                <p class="channel-stats">
                  {{ channel.videoCount }}
                  {{ $t('youtube.videos-retrieved') }} •
                  {{ $t('youtube.last-update') }}:
                  {{ formatDate(channel.lastUpdate) }}
                </p>
                <div
                  v-if="channelStats[channel.channelId]"
                  class="channel-api-stats"
                >
                  <p class="api-stats">
                    <strong>{{ $t('youtube.youtube-stats') }}:</strong><br />
                    •
                    {{
                      channelStats[
                        channel.channelId
                      ].videoCount.toLocaleString()
                    }}
                    {{ $t('youtube.total-videos') }}<br />
                    •
                    {{
                      channelStats[
                        channel.channelId
                      ].subscriberCount.toLocaleString()
                    }}
                    {{ $t('youtube.subscribers') }}<br />
                    •
                    {{
                      channelStats[channel.channelId].viewCount.toLocaleString()
                    }}
                    {{ $t('youtube.total-views') }}
                  </p>
                  <p
                    v-if="
                      channel.videoCount <
                      channelStats[channel.channelId].videoCount
                    "
                    class="incomplete-status"
                  >
                    ⚠️
                    {{
                      channelStats[channel.channelId].videoCount -
                      channel.videoCount
                    }}
                    {{ $t('youtube.missing-videos') }}
                  </p>
                </div>
                <p v-if="channel.isComplete" class="complete-status">
                  ✅ {{ $t('youtube.complete-channel') }}
                </p>
              </div>

              <div class="channel-actions">
                <button
                  @click="refreshChannel(channel.channelId)"
                  :disabled="loading"
                  class="refresh-button"
                >
                  {{
                    loading ? $t('youtube.refreshing') : $t('youtube.refresh')
                  }}
                </button>
                <button
                  v-if="
                    !channel.isComplete &&
                    channelStats[channel.channelId] &&
                    channel.videoCount <
                      channelStats[channel.channelId].videoCount
                  "
                  @click="forceCompleteChannel(channel.channelId)"
                  :disabled="loading"
                  class="force-complete-button"
                >
                  {{
                    loading ? $t('youtube.completing') : $t('youtube.complete')
                  }}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: var(--color-gold-300);
  font-size: var(--title-base);
  margin: 0 0 2rem 0;
  text-align: center;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.success-message {
  background-color: #efe;
  color: #363;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #cfc;
}

/* Navigation des onglets */
.tabs-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--color-gold-400);
  padding-bottom: 1rem;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--color-grey-100);
  color: var(--color-grey-600);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  background-color: var(--color-gold-200);
  color: var(--color-gold-600);
}

.tab-button.active {
  background-color: var(--color-gold-400);
  color: var(--color-grey-50);
}

.tab-icon {
  font-size: 1.125rem;
}

/* Contenu des onglets */
.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Styles YouTube */
.add-channel-section,
.channels-section {
  margin-bottom: 3rem;
}

.add-channel-section h2,
.channels-section h2 {
  color: var(--color-gold-300);
  font-size: var(--title-xs);
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gold-400);
}

.add-channel-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.channel-input {
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-grey-100);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.channel-input:focus {
  outline: none;
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(var(--color-gold-400), 0.1);
}

.add-button,
.refresh-button,
.force-complete-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  color: var(--color-grey-50);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-button,
.refresh-button {
  background-color: var(--color-gold-400);
}

.force-complete-button {
  background-color: #059669;
}

.add-button:hover:not(:disabled),
.refresh-button:hover:not(:disabled) {
  background-color: var(--color-gold-300);
}

.force-complete-button:hover:not(:disabled) {
  background-color: #047857;
}

.add-button:disabled,
.refresh-button:disabled,
.force-complete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.no-channels {
  text-align: center;
  padding: 2rem;
  color: var(--color-blue-400);
  font-size: 1.125rem;
}

.channels-list {
  display: grid;
  gap: 1rem;
}

.channel-card {
  background-color: var(--color-gold-50);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.channel-info {
  flex: 1;
}

.channel-name {
  color: var(--color-blue-400);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.channel-id {
  color: var(--color-grey-300);
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  font-family: monospace;
}

.channel-stats {
  color: var(--color-gold-300);
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.complete-status {
  color: var(--color-gold-400);
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}

.channel-api-stats {
  margin: 0.5rem 0;
  padding: 0.75rem;
  background-color: var(--color-grey-50);
  border-radius: 0.5rem;
  border-left: 3px solid var(--color-gold-300);
}

.api-stats {
  color: var(--color-blue-400);
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.incomplete-status {
  color: #d97706;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}

.complete-badge {
  background-color: var(--color-gold-400);
  color: var(--color-grey-50);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.channel-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }

  .tabs-navigation {
    flex-wrap: wrap;
  }

  .add-channel-form {
    flex-direction: column;
    align-items: stretch;
  }

  .channel-input {
    min-width: auto;
  }

  .channel-card {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .channel-actions {
    justify-content: center;
  }
}
</style>
