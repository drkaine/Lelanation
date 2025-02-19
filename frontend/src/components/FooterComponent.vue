<script setup lang="ts">
import { useConnexionStore } from '@/stores/connexionStore'
const connexionStore = useConnexionStore()
</script>

<template>
  <footer class="footer">
    <div class="connect" v-if="connexionStore.isLoggedIn">
      <p>Mode Lelariva</p>
    </div>
    <div class="right">
      <RouterLink to="/legal" class="footer-link">Lelalegal</RouterLink>
      <a
        href="https://github.com/drkaine"
        target="_blank"
        title="drkaine"
        class="footer-link"
      >
        @darkaine
      </a>
    </div>
  </footer>
</template>
