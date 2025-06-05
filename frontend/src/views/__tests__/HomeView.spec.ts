import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import SocialLinks from '@/components/home/SocialLinks.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/',
    query: {},
    hash: '',
  }),
}))

vi.mock('@/composables/useSEOHead', () => ({
  useSEOHead: vi.fn(),
}))

vi.mock('@vueuse/head', () => ({
  useHead: vi.fn(),
}))

describe('HomeView', () => {
  const wrapper = mount(HomeView, {
    global: {
      components: {
        HeroSection,
        SocialLinks,
      },
      config: {
        globalProperties: {
          $t: (key: string) => key,
        },
      },
    },
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    const heroSection = wrapper.findComponent(HeroSection)
    expect(heroSection.exists()).toBe(true)
    expect(heroSection.props()).toEqual({
      imageUrl: '/assets/images/lelariva.webp',
      imageAlt: 'Lelariva',
    })
  })

  it('contains social links component', () => {
    const socialLinks = wrapper.findComponent(SocialLinks)
    expect(socialLinks.exists()).toBe(true)
  })
})
