<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChampionStore } from '@/stores/championStore'
import type { ChampionSkillsOrder } from '@/types/champion'
const championStore = useChampionStore()

const skillPoints = ref<ChampionSkillsOrder>({
  A: [] as number[],
  Z: [] as number[],
  E: [] as number[],
  R: [] as number[],
})

const SKILL_LIMITS = {
  A: 5,
  Z: 5,
  E: 5,
  R: 3,
}

const toggleSkill = (skill: keyof typeof skillPoints.value, level: number) => {
  const points = skillPoints.value[skill]
  const index = points.indexOf(level)

  if (index !== -1) {
    points.splice(index, 1)
    return
  }

  if (points.length >= SKILL_LIMITS[skill]) {
    return
  }

  const isLevelTaken = Object.values(skillPoints.value).some(arr =>
    arr.includes(level),
  )
  if (isLevelTaken) return

  points.push(level)
  points.sort((a, b) => a - b)
}

const getSpellImage = (skill: string) => {
  const spellIndex = { A: 0, Z: 1, E: 2, R: 3 }
  const spell =
    championStore.selectedChampion?.spells?.[
      spellIndex[skill as keyof typeof spellIndex]
    ]

  if (spell) return `/assets/icons/champions/sorts/${spell.id}.png`
}

const getSpellInfo = (skill: string) => {
  const spellIndex = { A: 0, Z: 1, E: 2, R: 3 }
  const spell =
    championStore.selectedChampion?.spells?.[
      spellIndex[skill as keyof typeof spellIndex]
    ]
  if (!spell) return null
  return {
    name: spell.name,
    description: spell.description,
    cooldown: spell.cooldownBurn,
    cost: spell.costBurn,
    range: spell.rangeBurn,
  }
}

const updateChampionSkillsOrder = () => {
  championStore.setChampionSkillsOrder(skillPoints.value)
}

watch(
  skillPoints,
  () => {
    updateChampionSkillsOrder()
  },
  { deep: true },
)
</script>

<template>
  <div class="skill-order">
    <h3>{{ $t('skill-order.title') }}</h3>
    <div class="skill-grid">
      <div class="level-row">
        <div class="skill-label-spacer"></div>
        <div v-for="i in 18" :key="i" class="level-number">{{ i }}</div>
      </div>
      <div
        v-for="skill in ['A', 'Z', 'E', 'R'] as const"
        :key="skill"
        class="skill-row"
      >
        <div class="skill-label-container">
          <div class="tooltip-skill-container">
            <img :src="getSpellImage(skill)" :alt="skill" class="skill-icon" />
            <div class="tooltip-skill" v-if="getSpellInfo(skill)">
              <div class="tooltip-skill-header">
                <img
                  :src="getSpellImage(skill)"
                  :alt="skill"
                  class="tooltip-skill-icon"
                />
                <h4>{{ getSpellInfo(skill)?.name }}</h4>
              </div>
              <p v-html="getSpellInfo(skill)?.description"></p>
              <div class="tooltip-skill-stats">
                <div class="stat-row" v-if="getSpellInfo(skill)?.cooldown">
                  <span class="stat-label">{{
                    $t('skill-order.cooldown')
                  }}</span>
                  <span class="stat-value"
                    >{{ getSpellInfo(skill)?.cooldown }}s</span
                  >
                </div>
                <div class="stat-row" v-if="getSpellInfo(skill)?.cost">
                  <span class="stat-label">{{ $t('skill-order.cost') }}</span>
                  <span class="stat-value">{{
                    getSpellInfo(skill)?.cost
                  }}</span>
                </div>
                <div class="stat-row" v-if="getSpellInfo(skill)?.range">
                  <span class="stat-label">{{ $t('skill-order.range') }}</span>
                  <span class="stat-value">{{
                    getSpellInfo(skill)?.range
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="skill-label">{{ skill }}</div>
        </div>
        <div
          v-for="i in 18"
          :key="`${skill}-${i}`"
          class="skill-cell"
          :class="{
            filled: skillPoints[skill].includes(i),
            available:
              !Object.values(skillPoints).some(arr => arr.includes(i)) &&
              skillPoints[skill].length < SKILL_LIMITS[skill],
          }"
          @click="toggleSkill(skill, i)"
        >
          {{ skillPoints[skill].includes(i) ? i : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-order {
  width: 100%;
  overflow-x: auto;
  padding: 1rem 0;
}

.skill-grid {
  min-width: min-content;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.level-row,
.skill-row {
  display: grid;
  grid-template-columns: 60px repeat(18, minmax(25px, 30px));
  gap: 4px;
}

.skill-label-spacer {
  width: 60px;
}

.skill-label-container {
  width: 60px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.skill-icon {
  width: 25px;
  height: 25px;
  border-radius: 4px;
}

.level-number,
.skill-cell {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
}

@media (max-width: 768px) {
  .skill-order {
    padding: 0.5rem;
  }

  .level-row,
  .skill-row {
    grid-template-columns: 50px repeat(18, minmax(20px, 25px));
    gap: 2px;
  }

  .skill-label-spacer,
  .skill-label-container {
    width: 50px;
  }

  .skill-icon {
    width: 20px;
    height: 20px;
  }

  .level-number,
  .skill-cell {
    font-size: var(--text-xs);
  }
}

.tooltip-skill-stats {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gold-300);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: var(--text-sm);
}

.stat-label {
  color: var(--color-gold-300);
}

.stat-value {
  color: var(--color-grey-50);
}
</style>
