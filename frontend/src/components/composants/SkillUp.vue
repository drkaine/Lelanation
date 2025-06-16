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
  </div>
</template>
