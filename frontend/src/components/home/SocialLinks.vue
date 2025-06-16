<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed } from 'vue'
import type { SocialLink } from '@/types/social'
import TikTokIcon from '@/components/icons/TikTokIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'
import DiscordIcon from '@/components/icons/DiscordIcon.vue'
import YouTubeIcon from '@/components/icons/YouTubeIcon.vue'
import TwitchIcon from '@/components/icons/TwitchIcon.vue'
import PatreonIcon from '@/components/icons/PatreonIcon.vue'
import InstagramIcon from '@/components/icons/InstagramIcon.vue'
import WebIcon from '@/components/icons/WebIcon.vue'
import TableIcon from '@/components/icons/TableIcon.vue'
import DocumentIcon from '@/components/icons/DocumentIcon.vue'

const { t, locale } = useI18n()
const shouldLoadIcons = ref(false)

onMounted(() => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      setTimeout(() => {
        shouldLoadIcons.value = true
      }, 200)
    })
  } else {
    setTimeout(() => {
      shouldLoadIcons.value = true
    }, 1000)
  }
})

const allSocialLinks: SocialLink[] = [
  {
    href: 'https://discord.com/invite/RrXCpsFGrw',
    icon: 'discord-custom',
    text: t('home.links.discord'),
  },
  {
    href: 'https://www.patreon.com/c/Lelariva/posts',
    icon: 'patreon-custom',
    text: t('home.links.patreon'),
  },
  {
    href: 'https://www.youtube.com/@Lelariva_LoL/featured',
    icon: 'youtube-custom',
    text: t('home.links.youtube'),
  },
  {
    href: 'https://www.twitch.tv/lelariva',
    icon: 'twitch-custom',
    text: t('home.links.twitch'),
  },
  {
    href: 'https://x.com/Lelariva_fr',
    icon: 'x-custom',
    text: t('home.links.twitter'),
  },
  {
    href: 'https://www.tiktok.com/@lelariva_fr',
    icon: 'tiktok-custom',
    text: t('home.links.tiktok'),
  },
  {
    href: 'https://www.lelariva.fr/',
    icon: 'web-custom',
    text: t('home.links.website'),
  },
  {
    href: 'https://www.instagram.com/Lelariva_fr',
    icon: 'instagram-custom',
    text: t('home.links.instagram'),
  },
  {
    href: 'https://docs.google.com/spreadsheets/d/1J3CRQZvwkef8EECoj_QtoVu-pFyH9F5JsuxGhXs2MRE/edit?gid=1495176325#gid=1495176325',
    icon: 'table-custom',
    text: t('home.links.matchups'),
  },
  {
    href: 'https://docs.google.com/document/d/1_RqfOlWJ9Vq9egGb6fZpq6cNdeActg1heydkeeF-_S8/edit?tab=t.0#heading=h.djyl3yxo5q56',
    icon: 'document-custom',
    text: t('home.links.progress-fr'),
    lang: 'fr',
  },
  {
    href: 'https://docs.google.com/document/d/1RSzH0Gvb2ZB9iW_Yu4TRgb-7VMnSSekcfwVBJLJgkK4/edit?tab=t.0',
    icon: 'document-custom',
    text: t('home.links.progress-en'),
    lang: 'en',
  },
]

const socialLinks = computed(() => {
  return allSocialLinks.filter(link => {
    if ('lang' in link) {
      if (locale.value === 'en') {
        return link.lang === 'en'
      } else {
        return link.lang === 'fr'
      }
    }
    return true
  })
})
</script>

<template>
  <section class="social-section">
    <div class="social-links">
      <a
        v-for="link in socialLinks"
        :key="link.href"
        class="social-link"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`Suivre Lelariva sur ${link.text}`"
      >
        <template v-if="shouldLoadIcons">
          <XIcon
            v-if="link.icon === 'x-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <TikTokIcon
            v-else-if="link.icon === 'tiktok-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <DiscordIcon
            v-else-if="link.icon === 'discord-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <YouTubeIcon
            v-else-if="link.icon === 'youtube-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <TwitchIcon
            v-else-if="link.icon === 'twitch-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <PatreonIcon
            v-else-if="link.icon === 'patreon-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <InstagramIcon
            v-else-if="link.icon === 'instagram-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <WebIcon
            v-else-if="link.icon === 'web-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <TableIcon
            v-else-if="link.icon === 'table-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
          <DocumentIcon
            v-else-if="link.icon === 'document-custom'"
            :width="24"
            :height="24"
            class="custom-icon"
            :alt="link.text"
          />
        </template>
        <div v-else class="icon-placeholder" :aria-label="link.text"></div>
        <span class="link-text">{{ link.text }}</span>
      </a>
    </div>
  </section>

  <div class="seo-social-links" aria-hidden="true">
    <a href="https://x.com/Lelariva_fr" rel="noopener">Twitter/X</a>
    <a href="https://www.youtube.com/@Lelariva_LoL/featured" rel="noopener"
      >YouTube</a
    >
    <a href="https://www.instagram.com/Lelariva_fr" rel="noopener">Instagram</a>
    <a href="https://www.twitch.tv/lelariva" rel="noopener">Twitch</a>
    <a href="https://discord.com/invite/RrXCpsFGrw" rel="noopener">Discord</a>
    <a href="https://www.tiktok.com/@lelariva_fr" rel="noopener">TikTok</a>
  </div>
</template>

<style scoped>
.social-section {
  text-align: center;
  margin: 2rem 0;
}

.social-title {
  color: var(--color-gold-300);
  font-size: var(--title-xs);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gold-400);
  display: inline-block;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
  z-index: 0;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(200, 155, 60, 0.1),
    rgba(240, 230, 210, 0.05)
  );
  border: 1px solid rgba(200, 155, 60, 0.3);
  border-radius: 8px;
  color: var(--color-gold-300);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;
  justify-content: flex-start;
  cursor: pointer !important;
  position: relative;
  z-index: 100;
  user-select: none;
  pointer-events: auto !important;
  touch-action: manipulation;
}

.social-link:hover {
  background: linear-gradient(
    135deg,
    rgba(200, 155, 60, 0.2),
    rgba(240, 230, 210, 0.1)
  );
  border-color: var(--color-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(200, 155, 60, 0.2);
  color: var(--color-gold-200);
  z-index: 101;
  cursor: pointer !important;
}

.custom-icon {
  min-width: 24px;
  min-height: 24px;
  flex-shrink: 0;
  pointer-events: none !important;
  user-select: none;
}

.icon-fixed-size {
  min-width: 24px;
  min-height: 24px;
  flex-shrink: 0;
}

.icon-placeholder {
  min-width: 24px;
  min-height: 24px;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: rgba(200, 155, 60, 0.2);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
  pointer-events: none !important;
  user-select: none;
}

.link-text {
  pointer-events: none !important;
  user-select: none;
  cursor: pointer !important;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .social-links {
    gap: 0.5rem;
  }

  .social-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-width: 100px;
  }
}

.seo-social-links {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.seo-social-links a {
  color: inherit;
  text-decoration: none;
}
</style>
