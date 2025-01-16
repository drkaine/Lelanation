<script setup lang="ts">
import { useConnexionStore } from '@/stores/connexionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const connexionStore = useConnexionStore()

if (!connexionStore.isLoggedIn) {
  connexionStore.login()
  router.push('/build')
} else {
  connexionStore.logout()
  router.push('/build')
}
</script>
