import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ItemsSelection from '../Selection/ItemsSelection.vue'
import { createApp } from 'vue'

describe('ItemsSelection', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
  })

  const wrapper = mount(ItemsSelection, {
    global: {
      plugins: [createPinia()],
    },
  })

  it('renders filter buttons', () => {
    const buttons = wrapper.findAll('.filter button')
    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons[0].text()).toBe('Tous')
  })

  it('filters items when tag is selected', async () => {
    const damageButton = wrapper.find('button:nth-child(2)')
    await damageButton.trigger('click')
    expect(damageButton.classes()).toContain('active')
  })

  it('displays different item categories', () => {
    const categoryElements = wrapper.findAll('.group.small')

    const categories = ['Basic items', 'Epic items', 'Legendary items']

    categories.forEach(categoryName => {
      const hasCategory = Array.from(categoryElements).some(el =>
        el.text().toLowerCase().includes(categoryName.toLowerCase()),
      )
      expect(hasCategory, `Category "${categoryName}" not found`).toBe(true)
    })
  })

  it('shows tooltip on item hover', async () => {
    const firstItem = wrapper.find('.tooltip button')
    await firstItem.trigger('mouseenter')
    const tooltip = wrapper.find('.box')
    expect(tooltip.exists()).toBe(true)
  })
})
