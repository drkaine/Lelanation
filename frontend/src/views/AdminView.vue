<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConnexionStore } from '@/stores/connexionStore'
import AnalyticsTab from '@/components/Admin/AnalyticsTab.vue'
import TierListTab from '@/components/Admin/TierListTab.vue'
import DictionnaireTab from '@/components/Admin/DictionnaireTab.vue'
import ContactTab from '@/components/Admin/ContactTab.vue'

const connexionStore = useConnexionStore()

const activeTab = ref('Tier-list')

const router = useRouter()

const nameAdmin = [import.meta.env.VITE_ADMIN, import.meta.env.VITE_ADMIN_RIGHT]

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
})

if (!nameAdmin.includes(props.name) || !connexionStore.isLoggedIn) {
  router.push('/')
}

const SuperAdmin = nameAdmin[1] === props.name
</script>

<template>
  <div class="admin-container">
    <h1>Administration</h1>

    <div class="admin-tabs" v-if="SuperAdmin">
      <button
        v-for="tab in ['Tier-list', 'analytique', 'dictionnaire', 'contact']"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab.toUpperCase() }}
      </button>
    </div>

    <div v-if="activeTab === 'Tier-list'" class="tab-content">
      <h2>Tier-list</h2>
      <TierListTab />
    </div>

    <div v-else-if="activeTab === 'analytique'" class="tab-content">
      <h2>Analytiques</h2>
      <AnalyticsTab />
    </div>

    <div v-else-if="activeTab === 'dictionnaire'" class="tab-content">
      <h2>Dictionnaire</h2>
      <DictionnaireTab />
    </div>

    <div v-else-if="activeTab === 'contact'" class="tab-content">
      <h2>Messages de Contact</h2>
      <ContactTab />
    </div>
  </div>
</template>

<style scoped></style>
