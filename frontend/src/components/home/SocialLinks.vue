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

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 1px solid var(--l-gold4);
  border-radius: 4px;
  color: var(--l-gold2);
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-link svg {
  font-size: 1.5rem;
}

.social-link:hover {
  background-color: var(--l-gold5);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .social-links {
    flex-direction: column;
    align-items: center;
  }

  .social-link {
    width: 100%;
    text-align: center;
  }
}
</style>
