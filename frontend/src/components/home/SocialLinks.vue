<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import type { SocialLink } from '@/types/social'

const { t } = useI18n()

const socialLinks: SocialLink[] = [
  {
    href: 'https://discord.com/invite/RrXCpsFGrw',
    icon: 'mdi:discord',
    text: t('home.links.discord'),
  },
  {
    href: 'https://www.patreon.com/c/Lelariva/posts',
    icon: 'mdi:patreon',
    text: t('home.links.patreon'),
  },
  {
    href: 'https://www.youtube.com/@Lelariva_LoL/featured',
    icon: 'mdi:youtube',
    text: t('home.links.youtube'),
  },
  {
    href: 'https://www.twitch.tv/lelariva',
    icon: 'mdi:twitch',
    text: t('home.links.twitch'),
  },
  {
    href: 'https://x.com/Lelariva_fr',
    icon: 'mdi:twitter',
    text: t('home.links.twitter'),
  },
  {
    href: 'https://www.tiktok.com/@lelariva_fr',
    icon: 'mdi:music-note',
    text: t('home.links.tiktok'),
  },
  {
    href: 'https://www.lelariva.fr/',
    icon: 'mdi:web',
    text: t('home.links.website'),
  },
]
</script>

<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.href"
      class="social-link"
      :href="link.href"
      target="_blank"
    >
      <Icon :icon="link.icon" />
      <span>{{ link.text }}</span>
    </a>
  </div>
</template>
