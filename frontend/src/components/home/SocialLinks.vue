<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface SocialLink {
  href: string
  icon: string
  text: string
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://discord.gg/uBqgfMbq',
    icon: 'mdi:discord',
    text: 'Lelaricord',
  },
  {
    href: 'https://www.patreon.com/c/Lelariva/posts',
    icon: 'mdi:patreon',
    text: 'Lepatreonva',
  },
  {
    href: 'https://www.youtube.com/@Lelariva_LoL/featured',
    icon: 'mdi:youtube',
    text: 'Lelaritube',
  },
  {
    href: 'https://www.twitch.tv/lelariva',
    icon: 'mdi:twitch',
    text: 'Lelaritwitch',
  },
  { href: 'https://x.com/Lelariva_fr', icon: 'mdi:twitter', text: 'LelarivaX' },
  { href: 'https://www.lelariva.fr/', icon: 'mdi:web', text: 'Lelariva' },
]
</script>

<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.href"
      class="social-link"
      :href="link.href"
    >
      <Icon :icon="link.icon" />
      <span>{{ link.text }}</span>
    </a>
  </div>
</template>
