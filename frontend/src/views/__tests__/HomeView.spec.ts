import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../HomeView.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import SocialLinks from '@/components/home/SocialLinks.vue'

describe('HomeView', () => {
  const wrapper = mount(HomeView, {
    global: {
      components: {
        HeroSection,
        SocialLinks,
      },
    },
  })

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true)
    const heroSection = wrapper.findComponent(HeroSection)
    expect(heroSection.exists()).toBe(true)
    expect(heroSection.props()).toEqual({
      title: 'Lelandriva vous saluriva tous !',
      subtitle: 'Retrouver le grand Lelariva',
      imageUrl: '/assets/images/lelariva.png',
      imageAlt: 'Lelariva',
    })
  })

  it('contains social links component', () => {
    const socialLinks = wrapper.findComponent(SocialLinks)
    expect(socialLinks.exists()).toBe(true)
  })
})
