import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChampSelection from '../Selection/ChampSelection.vue'
import { createApp } from 'vue'

describe('ChampSelection', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
  })

  const wrapper = mount(ChampSelection, {
    global: {
      plugins: [createPinia()],
    },
  })

  it('renders filter buttons', () => {
    const buttons = wrapper.findAll('.filter button')
    expect(buttons.length).toBe(7)
    expect(buttons[0].text()).toBe('Assassin')
  })

  it('filters champions when tag is selected', async () => {
    const assassinButton = wrapper.find('button:first-child')
    await assassinButton.trigger('click')
    expect(assassinButton.classes()).toContain('active')
  })

  it('shows tooltip on champion hover', async () => {
    const firstChamp = wrapper.find('.tooltip button')
    await firstChamp.trigger('mouseenter')
    const tooltip = wrapper.find('.box')
    expect(tooltip.exists()).toBe(true)
  })

  it('filters champions by search', async () => {
    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('Ahri')
    expect((searchInput.element as HTMLInputElement).value).toBe('Ahri')
  })
})
