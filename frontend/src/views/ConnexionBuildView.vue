<script setup lang="ts">
import { useConnexionStore } from '@/stores/connexionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const connexionStore = useConnexionStore()

const nameTarget = import.meta.env.VITE_NAME

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

if (nameTarget === props.name) {
  if (!connexionStore.isLoggedIn) {
    connexionStore.login()
    router.push('/build')
  } else {
    connexionStore.logout()
    router.push('/build')
  }
} else {
  router.push('/')
}
</script>
