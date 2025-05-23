import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import SocialLinks from '@/components/home/SocialLinks.vue'

const mockUseI18n = () => ({
  t: (key: string) => key,
  locale: 'en',
})

vi.mock('vue-i18n', () => ({
  useI18n: () => mockUseI18n(),
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
      imageUrl: '/assets/images/lelariva.png',
      imageAlt: 'Lelariva',
    })
  })

  it('contains social links component', () => {
    const socialLinks = wrapper.findComponent(SocialLinks)
    expect(socialLinks.exists()).toBe(true)
  })
})
