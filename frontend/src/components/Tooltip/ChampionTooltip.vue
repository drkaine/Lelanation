<script setup lang="ts">
import type { Champion } from '@/types/champion'

const props = defineProps<{
  champion: Champion | null
}>()
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
        <div class="desc">
          {{ props.champion?.passive.description }}
        </div>
      </div>
      <div
        class="spell"
        v-for="(spell, index) in props.champion?.spells"
        :key="index"
      >
        <div class="img">
          <img
            :src="'/assets/icons/champions/sorts/' + spell.id + '.png'"
            :alt="spell.name"
          />
        </div>
        <div class="desc">
          {{ spell.description }}
        </div>
      </div>
    </div>
  </div>
</template>
