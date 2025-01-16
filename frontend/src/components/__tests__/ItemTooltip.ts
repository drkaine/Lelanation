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
    stats: {
      FlatMagicDamageMod: 0,
      FlatCritChanceMod: 0,
      FlatHPRegenMod: 0,
      PercentLifeStealMod: 0,
      FlatSpellBlockMod: 0,
      FlatMovementSpeedMod: 0,
      FlatArmorMod: 0,
      FlatPhysicalDamageMod: 0,
      FlatHPPoolMod: 0,
      PercentMovementSpeedMod: 0,
      PercentAttackSpeedMod: 0,
      PercentArmorMod: 0,
      PercentHealthRegenMod: 0,
      PercentSpellVamp: 0,
      PercentLifeSteal: 0,
      FlatEnergyRegenMod: 0,
      FlatManaRegenMod: 0,
      FlatMPPoolMod: 0,
      FlatAD: 0,
      FlatAP: 0,
      FlatCooldownReduction: 0,
      PercentCooldownReduction: 0,
      FlatLethality: 0,
      FlatOmnivamp: 0,
      PercentOmnivamp: 0,
      FlatShield: 0,
      PercentShield: 0,
      FlatTenacity: 0,
      PercentTenacity: 0,
      FlatSpellVamp: 0,
      FlatHealthRegen: 0,
      PercentHealthRegen: 0,
      FlatArmorPenetration: 0,
      PercentArmorPenetration: 0,
      FlatMagicPenetration: 0,
      PercentMagicPenetration: 0,
      FlatDamageReduction: 0,
      PercentDamageReduction: 0,
      FlatAttackRangeMod: 0,
    },
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
      stats: {
        FlatMagicDamageMod: null,
        FlatCritChanceMod: null,
        FlatHPRegenMod: null,
        PercentLifeStealMod: null,
        FlatSpellBlockMod: null,
        FlatMovementSpeedMod: null,
        FlatArmorMod: null,
        FlatPhysicalDamageMod: null,
        FlatHPPoolMod: null,
        PercentMovementSpeedMod: null,
        PercentAttackSpeedMod: null,
        PercentArmorMod: null,
        PercentHealthRegenMod: null,
        PercentSpellVamp: null,
        PercentLifeSteal: null,
        FlatEnergyRegenMod: null,
        FlatManaRegenMod: null,
        FlatMPPoolMod: null,
        FlatAD: null,
        FlatAP: null,
        FlatCooldownReduction: null,
        PercentCooldownReduction: null,
        FlatLethality: null,
        FlatOmnivamp: null,
        PercentOmnivamp: null,
        FlatShield: null,
        PercentShield: null,
        FlatTenacity: null,
        PercentTenacity: null,
        FlatSpellVamp: null,
        FlatHealthRegen: null,
        PercentHealthRegen: null,
        FlatArmorPenetration: null,
        PercentArmorPenetration: null,
        FlatMagicPenetration: null,
        PercentMagicPenetration: null,
        FlatDamageReduction: null,
        PercentDamageReduction: null,
        FlatAttackRangeMod: null,
      },
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
      stats: {
        FlatMagicDamageMod: null,
        FlatCritChanceMod: null,
        FlatHPRegenMod: null,
        PercentLifeStealMod: null,
        FlatSpellBlockMod: null,
        FlatMovementSpeedMod: null,
        FlatArmorMod: null,
        FlatPhysicalDamageMod: null,
        FlatHPPoolMod: null,
        PercentMovementSpeedMod: null,
        PercentAttackSpeedMod: null,
        PercentArmorMod: null,
        PercentHealthRegenMod: null,
        PercentSpellVamp: null,
        PercentLifeSteal: null,
        FlatEnergyRegenMod: null,
        FlatManaRegenMod: null,
        FlatMPPoolMod: null,
        FlatAD: null,
        FlatAP: null,
        FlatCooldownReduction: null,
        PercentCooldownReduction: null,
        FlatLethality: null,
        FlatOmnivamp: null,
        PercentOmnivamp: null,
        FlatShield: null,
        PercentShield: null,
        FlatTenacity: null,
        PercentTenacity: null,
        FlatSpellVamp: null,
        FlatHealthRegen: null,
        PercentHealthRegen: null,
        FlatArmorPenetration: null,
        PercentArmorPenetration: null,
        FlatMagicPenetration: null,
        PercentMagicPenetration: null,
        FlatDamageReduction: null,
        PercentDamageReduction: null,
        FlatAttackRangeMod: null,
      },
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
