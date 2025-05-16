<script setup lang="ts">
import { ref } from 'vue'
import type { Stats } from '@/types/stat'
import type { Build } from '@/types/build'

const lvl = ref(1)

const props = defineProps<{
  build: Build
  total: number
}>()

const updateLevel = (newLevel: number) => {
  lvl.value = newLevel
}

const statTranslations: Record<string, string> = {
  hp: 'HP',
  hpregen: 'HP Regen',
  mp: 'Mana',
  mpregen: 'Mana Regen',
  armor: 'Armure',
  spellblock: 'Résistance magique',
  attackdamage: 'AD',
  movespeed: 'Vitesse de déplacement',
  attackrange: "Portée d'attaque",
  attackspeed: "Vitesse d'attaque",
  CDR: 'CDR',
  AP: 'AP',
  lethality: 'Léthalité',
  crit: 'Chance de critique (%)',
  magicPenetration: 'Pénétration magique',
  shield: 'Augmentation bouclier',
  omnivamp: 'Omnivamp (%)',
  tenacity: 'Tenacité (%)',
}

const statsList = [
  'hp',
  'hpregen',
  'mp',
  'mpregen',
  'armor',
  'spellblock',
  'attackdamage',
  'movespeed',
  'attackrange',
  'attackspeed',
  'CDR',
  'AP',
  'lethality',
  'crit',
  'magicPenetration',
  'shield',
  'omnivamp',
  'tenacity',
]

const statsListFiltered = statsList.filter(
  stat =>
    props.build.totalStats[lvl.value - 1][
      stat as keyof Stats
    ] !== '0',
)
</script>


<template>
<div class="stats-panel">
    <table class="stats-table">
      <thead>
        <tr>
          <th>{{ $t('build-recap.statistic') }}</th>
          <th>{{ $t('build-recap.base') }}</th>
          <th>{{ $t('build-recap.items') }}</th>
          <th>{{ $t('build-recap.total') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stat in statsListFiltered" :key="stat">
          <td>{{ statTranslations[stat] }}</td>
          <td>
            {{
              props.build?.baseStats[lvl - 1][
                stat as keyof Stats
              ]
            }}
          </td>
          <td>
            {{
              props.build?.buildItemStats[stat as keyof Stats]
            }}
          </td>
          <td>
            {{
              props.build?.totalStats[lvl - 1][
                stat as keyof Stats
              ]
            }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('build-recap.gold') }}</td>
          <td>0</td>
          <td>{{ props.total }}</td>
          <td>{{ props.total }}</td>
        </tr>
      </tbody>
    </table>
    <div class="level-selector">
      <div class="level-buttons">
        <button
          v-for="n in 18"
          :key="n"
          :class="['level-btn', { active: lvl === n }]"
          @click="updateLevel(n)"
        >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.stats-panel {
  border-radius: 8px;
  padding: 1rem;
}

.stats-table {
  border-collapse: collapse;
  margin-bottom: 0;
  border-bottom: 1px solid var(--color-gold-50);
}

.stats-table th,
.stats-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-gold-50);
}

.stats-table th {
  color: var(--color-gold-300);
  font-weight: bold;
}

.stats-table td {
  color: var(--color-gold-200);
}

.level-selector {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--color-grey-300);
  margin-top: -1px;
}

.level-buttons {
  display: grid;
  grid-template-columns: repeat(18, 30px);
  gap: 0.5rem;
  justify-content: center;
}

.level-btn {
  width: 30px;
  height: 30px;
  padding: 0;
  border: var(--border-size) solid transparent;
  color: var(--color-gold-300);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-btn:hover {
  border-color: var(--color-grey-300);
}

.level-btn.active {
  border-color: var(--color-gold-300);
  color: var(--color-grey-300);
  font-weight: bold;
}


@media (max-width: 768px) {
  .build-recap {
    padding: 1rem;
  }

  .sheet-section {
    max-width: 100%;
  }

  .build-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .actions-panel {
    margin-right: -10px;
  }

  .stats-table {
    font-size: var(--text-sm);
  }

  .stats-table th,
  .stats-table td {
    padding: 0.5rem;
  }

  .level-buttons {
    grid-template-columns: repeat(6, 25px);
    grid-template-rows: repeat(3, 25px);
  }

  .level-btn {
    width: 25px;
    height: 25px;
    font-size: var(--text-xs);
  }

}

</style>