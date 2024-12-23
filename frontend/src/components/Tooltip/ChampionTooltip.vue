<script setup lang="ts">
import { type Champion } from '../script/type'

const props = defineProps<{
  champion: Champion | null
}>()
</script>

<template>
  <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="header">
    <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="info">
      <img
        data-v-5bc51be1=""
        data-v-cbff5ddf-s=""
        class="img"
        :src="'/assets/icons/champions/' + champion?.image.full"
        :alt="champion?.name"
      />
      <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="text">
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name">
          {{ champion?.name }}
        </div>
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="title">
          {{ champion?.title }}
        </div>
      </div>
    </div>
    <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="tags">
      <div data-v-de17e6dc="" class="tag">
        {{
          champion?.tags
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
  <div data-v-cbff5ddf="" class="body">
    <hr data-v-cbff5ddf="" />
    <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="champ-block">
      <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="spells">
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="spell">
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="img passive">
            <img
              data-v-5bc51be1=""
              data-v-cbff5ddf-s=""
              :src="
                '/assets/icons/champions/passive/' +
                champion?.passive.image.full
              "
              :alt="champion?.passive.name"
            />
          </div>
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="desc">
            {{ champion?.passive.description }}
          </div>
        </div>
        <div
          data-v-5bc51be1=""
          data-v-cbff5ddf-s=""
          class="spell"
          v-for="(spell, index) in champion?.spells"
          :key="index"
        >
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="img">
            <img
              data-v-5bc51be1=""
              data-v-cbff5ddf-s=""
              :src="'/assets/icons/champions/spells/' + spell.id + '.png'"
              :alt="spell.name"
            />
          </div>
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="desc">
            {{ spell.description }}
          </div>
        </div>
      </div>
      <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="break"></div>
      <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="info">
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name attack">
          attack
        </div>
        <div
          data-v-5bc51be1=""
          data-v-cbff5ddf-s=""
          class="line attack"
          :style="{ width: props.champion?.info.attack + '0%' }"
        ></div>
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name magic">
          magic
        </div>
        <div
          data-v-5bc51be1=""
          data-v-cbff5ddf-s=""
          class="line magic"
          :style="{ width: props.champion?.info.magic + '0%' }"
        ></div>
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name defense">
          defense
        </div>
        <div
          data-v-5bc51be1=""
          data-v-cbff5ddf-s=""
          class="line defense"
          :style="{ width: props.champion?.info.defense + '0%' }"
        ></div>
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name difficulty">
          difficult
        </div>
        <div
          data-v-5bc51be1=""
          data-v-cbff5ddf-s=""
          class="line difficulty"
          :style="{ width: props.champion?.info.difficulty + '0%' }"
        ></div>
      </div>
    </div>
  </div>
</template>
