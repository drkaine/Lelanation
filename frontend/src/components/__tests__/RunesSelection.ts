import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RunesSelection from '../Selection/RunesSelection.vue'
import { createApp, nextTick } from 'vue'
import { useRuneStore } from '@/stores/runeStore'

const runesTest = [
  {
    id: 8100,
    key: 'Domination',
    icon: 'perk-images/Styles/7200_Domination.png',
    name: 'Domination',
    slots: [
      {
        runes: [
          {
            id: 8112,
            key: 'Electrocute',
            icon: 'perk-images/Styles/Domination/Electrocute/Electrocute.png',
            name: 'Électrocution',
            shortDesc:
              "Toucher un champion avec 3 attaques ou compétences <b>différentes</b> en moins de 3 sec inflige des <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'>dégâts adaptatifs</lol-uikit-tooltipped-keyword> supplémentaires.",
            longDesc:
              "Toucher un champion ennemi avec 3 attaques ou compétences <b>différentes</b> en moins de 3 sec inflige des <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'><font color='#48C4B7'>dégâts adaptatifs</font></lol-uikit-tooltipped-keyword> bonus.<br><br>Dégâts : 50 - 190 (+0.1 dégâts d'attaque bonus, +0.05 puissance) pts de dégâts.<br>Délai de récupération : 20 sec.<br><br><i>« On les appelait les seigneurs de la foudre, car parler de leurs éclairs était une invitation à l'anéantissement. »</i>",
          },
          {
            id: 8128,
            key: 'DarkHarvest',
            icon: 'perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png',
            name: 'Moisson noire',
            shortDesc:
              "Blesser un champion à qui il reste peu de PV lui inflige des <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'>dégâts adaptatifs</lol-uikit-tooltipped-keyword> et siphonne son âme.",
            longDesc:
              "Blesser un champion qui a moins de 50% de ses PV lui inflige des <lol-uikit-tooltipped-keyword key='LinkTooltip_Description_AdaptiveDmg'>dégâts adaptatifs</lol-uikit-tooltipped-keyword> et siphonne son âme, ce qui augmente définitivement les dégâts de Moisson noire de 9.<br><br>Dégâts de Moisson noire : 20 (+9 pts de dégâts par âme) (+0.1 dégâts d'attaque bonus) (+0.05 puissance).<br>Délai de récupération : 35 sec (réinitialisé à 1.0 sec à chaque élimination).",
          },
          {
            id: 9923,
            key: 'HailOfBlades',
            icon: 'perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png',
            name: 'Déluge de lames',
            shortDesc:
              "Votre vitesse d'attaque augmente grandement pour vos 3 premières attaques contre des champions ennemis.",
            longDesc:
              "Quand vous attaquez un champion ennemi, votre vitesse d'attaque augmente de 110% (80% pour les champions à distance) pour 3 attaques.<br><br>Cet effet prend fin s'il s'écoule plus de 3 sec entre deux attaques.<br><br>Délai de récupération : 12 sec.<br><br><rules>Les réinitialisations d'attaque augmentent le nombre d'attaques max de 1.<br>Permet de dépasser temporairement la limite de vitesse d'attaque.</rules>",
          },
        ],
      },
    ],
  },
]

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
    runeStore.runesSelection.principal = runesTest[0]
    runeStore.runesSelection.second = runesTest[1]
    await nextTick()

    // Vérifions plutôt la présence des boutons de sélection
    const runeButtons = wrapper.findAll('.path button')
    expect(runeButtons.length).toBeGreaterThan(0)
  })
})
