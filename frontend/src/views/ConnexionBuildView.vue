<script setup lang="ts">
import { useConnexionStore } from '@/stores/connexionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const connexionStore = useConnexionStore()

const nameTarget = [import.meta.env.VITE_NAME, import.meta.env.VITE_NAME_DEV]

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

if (nameTarget.includes(props.name)) {
  if (!connexionStore.isLoggedIn) {
    connexionStore.login(props.name)
    router.push('/build')
  } else {
    connexionStore.logout()
    router.push('/build')
  }
} else {
  router.push('/')
}
</script>
