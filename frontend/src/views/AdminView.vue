<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConnexionStore } from '@/stores/connexionStore'
import AnalyticsTab from '@/components/Admin/AnalyticsTab.vue'
import TierListTab from '@/components/Admin/TierListTab.vue'
import DictionnaireTab from '@/components/Admin/DictionnaireTab.vue'
import ContactTab from '@/components/Admin/ContactTab.vue'
import BuildsTab from '@/components/Admin/BuildsTab.vue'
import { useSEOHead } from '@/composables/useSEOHead'

useSEOHead({
  title: 'Administration - Lelanation',
  description: "Interface d'administration privée",
  noIndex: true,
})

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
    <h1>{{ $t('admin.title') }}</h1>

    <div class="admin-tabs" v-if="SuperAdmin">
      <button
        v-for="tab in [
          'Tier-list',
          'analytique',
          'dictionnaire',
          'contact',
          'builds',
        ]"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab.toUpperCase() }}
      </button>
    </div>

    <div v-if="activeTab === 'Tier-list'" class="tab-content">
      <h2>{{ $t('admin.tier-list') }}</h2>
      <TierListTab />
    </div>

    <div v-else-if="activeTab === 'analytique'" class="tab-content">
      <h2>{{ $t('admin.analytique') }}</h2>
      <AnalyticsTab />
    </div>

    <div v-else-if="activeTab === 'dictionnaire'" class="tab-content">
      <h2>{{ $t('admin.dictionnaire') }}</h2>
      <DictionnaireTab />
    </div>

    <div v-else-if="activeTab === 'contact'" class="tab-content">
      <h2>{{ $t('admin.contact') }}</h2>
      <ContactTab />
    </div>

    <div v-else-if="activeTab === 'builds'" class="tab-content">
      <h2>{{ $t('admin.builds') }}</h2>
      <BuildsTab />
    </div>
  </div>
</template>
