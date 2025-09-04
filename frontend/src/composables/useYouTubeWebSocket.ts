import { ref, onMounted, onUnmounted } from 'vue'

interface YouTubeUpdateMessage {
  type: 'youtube_update'
  channelId: string
  channelName: string
  videosAdded: number
  totalVideos: number
  lastVideoDate: string
  timestamp: number
}

interface ConnectionMessage {
  type: 'connection_established'
  message: string
  timestamp: number
}

type WebSocketMessage = YouTubeUpdateMessage | ConnectionMessage

export function useYouTubeWebSocket() {
  const isConnected = ref(false)
  const lastUpdate = ref<YouTubeUpdateMessage | null>(null)
  const connectionError = ref<string | null>(null)
  const ws = ref<WebSocket | null>(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    try {
      // Détecter automatiquement le protocole et l'hôte
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const wsUrl = `${protocol}//${host}`

      console.log('🔌 Tentative de connexion WebSocket:', wsUrl)

      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = () => {
        console.log('✅ Connexion WebSocket établie')
        isConnected.value = true
        connectionError.value = null
        reconnectAttempts.value = 0
      }

      ws.value.onmessage = event => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          if (message.type === 'connection_established') {
            console.log('📡 Message de connexion reçu:', message.message)
          } else if (message.type === 'youtube_update') {
            console.log('📡 Mise à jour YouTube reçue:', message)
            lastUpdate.value = message

            // Émettre un événement personnalisé pour notifier les composants
            window.dispatchEvent(
              new CustomEvent('youtube-update', {
                detail: message,
              }),
            )
          }
        } catch (error) {
          console.error(
            '❌ Erreur lors du parsing du message WebSocket:',
            error,
          )
        }
      }

      ws.value.onclose = event => {
        console.log('🔌 Connexion WebSocket fermée:', event.code, event.reason)
        isConnected.value = false

        // Tentative de reconnexion automatique
        if (reconnectAttempts.value < maxReconnectAttempts) {
          reconnectAttempts.value++
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.value),
            30000,
          ) // Backoff exponentiel, max 30s

          console.log(
            `🔄 Tentative de reconnexion ${reconnectAttempts.value}/${maxReconnectAttempts} dans ${delay}ms`,
          )

          setTimeout(() => {
            if (!isConnected.value) {
              connect()
            }
          }, delay)
        } else {
          connectionError.value = 'Impossible de se reconnecter au serveur'
          console.error(
            '❌ Nombre maximum de tentatives de reconnexion atteint',
          )
        }
      }

      ws.value.onerror = error => {
        console.error('❌ Erreur WebSocket:', error)
        connectionError.value = 'Erreur de connexion WebSocket'
      }
    } catch (error) {
      console.error(
        '❌ Erreur lors de la création de la connexion WebSocket:',
        error,
      )
      connectionError.value = 'Erreur lors de la création de la connexion'
    }
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    isConnected.value = false
  }

  const resetReconnectAttempts = () => {
    reconnectAttempts.value = 0
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    lastUpdate,
    connectionError,
    connect,
    disconnect,
    resetReconnectAttempts,
  }
}
