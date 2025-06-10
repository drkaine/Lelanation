<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, computed } from 'vue'
import type { SocialLink } from '@/types/social'
import TikTokIcon from '@/components/icons/TikTokIcon.vue'
import XIcon from '@/components/icons/XIcon.vue'

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
    icon: 'mdi:web',
    text: t('home.links.website'),
  },
  {
    href: 'https://www.instagram.com/Lelariva_fr',
    icon: 'mdi:instagram',
    text: t('home.links.instagram'),
  },
  {
    href: 'https://docs.google.com/spreadsheets/d/1J3CRQZvwkef8EECoj_QtoVu-pFyH9F5JsuxGhXs2MRE/edit?gid=1495176325#gid=1495176325',
    icon: 'mdi:table',
    text: t('home.links.matchups'),
  },
  {
    href: 'https://docs.google.com/document/d/1_RqfOlWJ9Vq9egGb6fZpq6cNdeActg1heydkeeF-_S8/edit?tab=t.0#heading=h.djyl3yxo5q56',
    icon: 'mdi:file-document',
    text: t('home.links.progress-fr'),
    lang: 'fr',
  },
  {
    href: 'https://docs.google.com/document/d/1RSzH0Gvb2ZB9iW_Yu4TRgb-7VMnSSekcfwVBJLJgkK4/edit?tab=t.0',
    icon: 'mdi:file-document',
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
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.href"
      class="social-link"
      :href="link.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <template v-if="shouldLoadIcons">
        <XIcon
          v-if="link.icon === 'x-custom'"
          :width="24"
          :height="24"
          class="custom-icon"
        />
        <TikTokIcon
          v-else-if="link.icon === 'tiktok-custom'"
          :width="24"
          :height="24"
          class="custom-icon"
        />
        <Icon
          v-else
          :icon="link.icon"
          width="24"
          height="24"
          style="min-width: 24px; min-height: 24px"
        />
      </template>
      <div
        v-else
        class="icon-placeholder"
        style="min-width: 24px; min-height: 24px; width: 24px; height: 24px"
      ></div>
      <span>{{ link.text }}</span>
    </a>
  </div>
</template>

<style scoped>
.custom-icon {
  min-width: 24px;
  min-height: 24px;
  flex-shrink: 0;
}
</style>
