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
    <h2>{{ $t('skill-order.title') }}</h2>
    <div class="skill-grid desktop">
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
          <img
            :src="getSpellImage(skill)"
            :alt="`Compétence ${skill} du champion`"
            class="skill-icon"
          />
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

    <div class="skill-grid mobile">
      <div class="skill-header-row">
        <div class="level-label-spacer"></div>
        <div
          v-for="skill in ['A', 'Z', 'E', 'R'] as const"
          :key="skill"
          class="skill-header"
        >
          <img
            :src="getSpellImage(skill)"
            :alt="`Compétence ${skill} du champion`"
            class="skill-icon"
          />
          <div class="skill-label">{{ skill }}</div>
        </div>
      </div>
      <div v-for="i in 18" :key="i" class="level-row-mobile">
        <div class="level-number-mobile">{{ i }}</div>
        <div
          v-for="skill in ['A', 'Z', 'E', 'R'] as const"
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
  max-width: 100vw;
}

.skill-grid.desktop {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 700px;
  background: var(--color-blue-900);
  border-radius: 8px;
  padding: 1rem;
  box-sizing: border-box;
  overflow-x: auto;
}

.skill-grid.mobile {
  display: none;
}

.level-row,
.skill-row {
  display: flex;
  align-items: center;
}

.skill-label-spacer {
  width: 40px;
}

.level-number {
  width: 32px;
  text-align: center;
  font-size: 0.95rem;
  color: var(--color-gold-300);
}

.skill-label-container {
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.skill-icon {
  width: 28px;
  height: 28px;
}

.skill-label {
  font-size: 0.95rem;
  color: var(--color-gold-300);
}

.skill-cell {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--color-blue-400);
  margin: 0 1px;
  text-align: center;
  line-height: 32px;
  font-size: 0.95rem;
  color: var(--color-gold-100);
  cursor: pointer;
  transition: background 0.2s;
}

.skill-cell.filled {
  background: var(--color-gold-300);
  color: var(--color-blue-900);
  font-weight: bold;
}

.skill-cell.available {
  background: var(--color-blue-200);
}

@media (max-width: 600px) {
  .skill-grid.desktop {
    display: none;
  }

  .skill-grid.mobile {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: var(--color-blue-900);
    border-radius: 8px;
    padding: 0.5rem;
    box-sizing: border-box;
    max-height: 70vh;
    overflow-y: auto;
  }

  .skill-header-row {
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    background: var(--color-blue-900);
    z-index: 1;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-blue-700);
    margin-bottom: 0.25rem;
  }

  .level-label-spacer {
    width: 32px;
    flex-shrink: 0;
  }

  .skill-header {
    width: 52px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }

  .skill-header .skill-icon {
    width: 24px;
    height: 24px;
  }

  .skill-header .skill-label {
    font-size: 0.8rem;
    color: var(--color-gold-300);
  }

  .level-row-mobile {
    display: flex;
    align-items: center;
  }

  .level-number-mobile {
    width: 32px;
    text-align: center;
    font-size: 0.8rem;
    color: var(--color-gold-300);
    font-weight: bold;
    flex-shrink: 0;
  }

  .skill-grid.mobile .skill-cell {
    width: 52px;
    height: 28px;
    border-radius: 4px;
    background: var(--color-blue-400);
    text-align: center;
    line-height: 28px;
    font-size: 0.75rem;
    color: var(--color-gold-100);
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .skill-grid.mobile .skill-cell.filled {
    background: var(--color-gold-300);
    color: var(--color-blue-900);
    font-weight: bold;
  }

  .skill-grid.mobile .skill-cell.available {
    background: var(--color-blue-200);
  }
}
</style>
