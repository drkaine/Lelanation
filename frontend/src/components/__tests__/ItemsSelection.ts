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

vi.mock('@/assets/files/data/en/item.json', () => ({
  default: {
    data: {
      item1: {
        name: 'Basic Test Item EN',
        description: 'Test Description EN',
        tags: ['damage'],
        image: { full: 'test.png' },
        maps: { '11': true, '12': false },
        gold: {
          purchasable: true,
          total: 500,
        },
      },
      item2: {
        name: 'Epic Test Item EN',
        description: 'Test Description EN',
        tags: ['damage'],
        image: { full: 'test2.png' },
        maps: { '11': true, '12': false },
        gold: {
          purchasable: true,
          total: 2000,
        },
      },
    },
  },
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'fr' },
    t: (key: string) => key,
  }),
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
    const buttons = wrapper.findAll('.filter-items button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('filters items when tag is selected', async () => {
    const wrapper = mount(ItemsSelection)
    await wrapper.vm.$nextTick()

    const damageButton = wrapper.find('.filter-items button:nth-child(2)')
    await damageButton.trigger('click')
    expect(damageButton.classes()).toContain('active')
  })

  it('loads items based on locale', async () => {
    const wrapper = mount(ItemsSelection)
    await wrapper.vm.$nextTick()

    const firstItem = wrapper.find('.items-grid .tooltip button')
    expect(firstItem.exists()).toBe(true)
  })
})
