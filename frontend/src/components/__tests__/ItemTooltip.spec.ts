import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemTooltip from '../Tooltip/ItemTooltip.vue'
import type { Item } from '@/types/item'

describe('ItemTooltip', () => {
  const mockItem = {
    name: 'Test Item',
    image: {
      full: 'test.png',
      sprite: 'test.png',
      group: 'item',
      x: 0,
      y: 0,
      w: 48,
      h: 48,
    },
    gold: {
      base: 400,
      total: 1000,
      sell: 400,
      purchasable: true,
    },
    description: 'Test description',
    colloq: '',
    plaintext: '',
    tags: [],
    maps: { '11': true },
    stats: {},
  } as Item

  const mockFrom = [
    {
      name: 'From Item',
      image: {
        full: 'from.png',
        sprite: 'test.png',
        group: 'item',
        x: 0,
        y: 0,
        w: 48,
        h: 48,
      },
      gold: {
        base: 200,
        total: 500,
        sell: 200,
        purchasable: true,
      },
      description: '',
      colloq: '',
      plaintext: '',
      tags: [],
      maps: { '11': true },
      stats: {},
    },
  ] as Item[]

  const mockInto = [
    {
      name: 'Into Item',
      image: {
        full: 'into.png',
        sprite: 'test.png',
        group: 'item',
        x: 0,
        y: 0,
        w: 48,
        h: 48,
      },
      gold: {
        base: 600,
        total: 1500,
        sell: 600,
        purchasable: true,
      },
      description: '',
      colloq: '',
      plaintext: '',
      tags: [],
      maps: { '11': true },
      stats: {},
    },
  ] as Item[]

  const wrapper = mount(ItemTooltip, {
    props: {
      item: mockItem,
      from: mockFrom,
      into: mockInto,
    },
  })

  it('renders item information correctly', () => {
    expect(wrapper.find('.name').text()).toBe('Test Item')
    expect(wrapper.find('.total').text()).toContain('1000')
    expect(wrapper.find('.sell').text()).toContain('400')
    expect(wrapper.find('.body').text()).toBe('Test description')
  })

  it('displays from items', () => {
    const fromItems = wrapper.findAll('.from .tip')
    expect(fromItems).toHaveLength(1)
    expect(fromItems[0].find('img').attributes('src')).toContain('from.png')
    expect(fromItems[0].find('.text').text()).toBe('500')
  })

  it('displays into items', () => {
    const intoItems = wrapper.findAll('.into .tip')
    expect(intoItems).toHaveLength(1)
    expect(intoItems[0].find('img').attributes('src')).toContain('into.png')
    expect(intoItems[0].find('.text').text()).toBe('1500')
  })
})
