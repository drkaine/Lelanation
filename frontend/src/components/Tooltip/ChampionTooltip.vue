<script setup lang="ts">
import type { Champion } from '@/types/champion'
import { computed } from 'vue'

const props = defineProps<{
  champion: Champion | null
}>()

const formatDescription = (text: string) => {
  return text
    .replace(/<font color='#3458eb'>/g, '<span class="blue">')
    .replace(/<font color='#FF9900'>/g, '<span class="orange">')
    .replace(/<font color='#FF0000'>/g, '<span class="red">')
    .replace(/<\/font>/g, '</span>')
}

const formattedPassive = computed(() =>
  formatDescription(props.champion?.passive.description || ''),
)

const formattedSpells = computed(() =>
  props.champion?.spells.map(spell => ({
    ...spell,
    description: formatDescription(spell.description),
  })),
)
</script>

<template>
  <div class="top">
    <div class="present">
      <img
        class="img"
        :src="'/assets/icons/champions/' + props.champion?.image.full"
        :alt="props.champion?.name"
      />
      <div class="text">
        <div class="name">
          {{ props.champion?.name }}
        </div>
        <div class="title-champ">
          {{ props.champion?.title }}
        </div>
      </div>
    </div>
    <div class="tags">
      <div class="tag">
        {{
          props.champion?.tags
            .map((tag: string) =>
              tag === 'Fighter'
                ? 'Combattant'
                : tag === 'Marksman'
                  ? 'Tireur'
                  : tag,
            )
            .join(', ')
        }}
      </div>
    </div>
  </div>
  <div class="body">
    <hr />
    <div class="spells">
      <div class="spell">
        <div class="img passive">
          <img
            :src="
              '/assets/icons/champions/passive/' +
              props.champion?.passive.image.full
            "
            :alt="props.champion?.passive.name"
          />
        </div>
        <div class="desc" v-html="formattedPassive"></div>
      </div>
      <div class="spell" v-for="(spell, index) in formattedSpells" :key="index">
        <div class="img">
          <img
            :src="'/assets/icons/champions/sorts/' + spell.id + '.png'"
            :alt="spell.name"
          />
        </div>
        <div class="desc" v-html="spell.description"></div>
      </div>
    </div>
  </div>
</template>

<style>
.desc {
  font-size: var(--text-xs);
  line-height: 1.4;
  color: var(--color-gold-500);
}

.desc .blue {
  color: #3458eb;
}

.desc .orange {
  color: #ff9900;
}

.desc .red {
  color: #ff0000;
}
</style>
