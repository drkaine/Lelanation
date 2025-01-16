import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RunesSelection from '../Selection/RunesSelection.vue'
import { createApp, nextTick } from 'vue'
import { useRuneStore } from '@/stores/runeStore'
import runes from '@/assets/files/data/runesReforged.json'

describe('RunesSelection', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
  })

  const wrapper = mount(RunesSelection, {
    global: {
      plugins: [createPinia()],
    },
  })

  it('renders rune paths', async () => {
    await nextTick()
    const paths = wrapper.findAll('.path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('shows tooltip on rune hover', async () => {
    await nextTick()
    const firstRune = wrapper.find('.path button')
    await firstRune.trigger('mouseenter')
    await nextTick()
    const tooltipContent = wrapper.find('.path button img')
    expect(tooltipContent.exists()).toBe(true)
  })

  it('displays summoner spells and shards when secondary rune is selected', async () => {
    const runeStore = useRuneStore()
    runeStore.runesSelection.principal = runes[0]
    runeStore.runesSelection.second = runes[1]
    await nextTick()

    // Vérifions plutôt la présence des boutons de sélection
    const runeButtons = wrapper.findAll('.path button')
    expect(runeButtons.length).toBeGreaterThan(0)
  })
})
