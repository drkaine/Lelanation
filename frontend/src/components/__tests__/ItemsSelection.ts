import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ItemsSelection from '../Selection/ItemsSelection.vue'
import { createApp } from 'vue'

vi.mock('@/assets/files/data/item.json', () => ({
  default: {
    data: {
      item1: {
        name: 'Basic Test Item',
        description: 'Test Description',
        tags: ['damage'],
        image: {
          full: 'test.png',
          sprite: 'test.png',
          group: 'item',
          x: 0,
          y: 0,
          w: 48,
          h: 48,
        },
        maps: { '11': true, '12': false },
        gold: {
          purchasable: true,
          total: 500,
        },
      },
      item2: {
        name: 'Epic Test Item',
        description: 'Test Description',
        tags: ['damage'],
        image: { full: 'test2.png' },
        maps: { '11': true, '12': false },
        gold: {
          purchasable: true,
          total: 2000,
        },
      },
      item3: {
        name: 'Legendary Test Item',
        description: 'Test Description',
        tags: ['damage'],
        image: { full: 'test3.png' },
        maps: { '11': true, '12': false },
        gold: {
          purchasable: true,
          total: 3500,
        },
      },
    },
  },
}))

describe('ItemsSelection', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
  })

  it('renders filter buttons', () => {
    const wrapper = mount(ItemsSelection)
    const buttons = wrapper.findAll('.filter button')
    expect(buttons.length).toBeGreaterThan(0)
    expect(buttons[0].text()).toBe('Tous')
  })

  it('filters items when tag is selected', async () => {
    const wrapper = mount(ItemsSelection)
    const damageButton = wrapper.find('button:nth-child(2)')
    await damageButton.trigger('click')
    expect(damageButton.classes()).toContain('active')
  })

  it('shows tooltip on item hover', async () => {
    const wrapper = mount(ItemsSelection)
    const firstItem = wrapper.find('.tooltip button')
    expect(firstItem.exists()).toBe(true)
    await firstItem.trigger('mouseenter')
    const tooltip = wrapper.find('.box')
    expect(tooltip.exists()).toBe(true)
  })
})
