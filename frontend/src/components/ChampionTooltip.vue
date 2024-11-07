<script setup lang="ts">

const props = defineProps<{
  champion: {
    image: { full: string }
    name: string
    title: string
    tags: string[]
    passive: { image: { full: string }; description: string }
    spells: Array<{
      id: string
      description: string
    }>
    info: Array<{
      attack: string
      magic: string
      defense: string
      difficulty: string
    }>
  }
}>()

const cleanDescription = (description: string) => {
  return description.replace(/<[^>]*>/g, '')
}
</script>

<template>
  <div data-v-de17e6dc="" class="type-champs box">
    <div data-v-de17e6dc="" class="header">
      <div data-v-de17e6dc="" class="info">
        <img
          data-v-de17e6dc=""
          class="img"
          :src="
            'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/' +
            props.champion.image.full
          "
        />
        <div data-v-de17e6dc="" class="text">
          <div data-v-de17e6dc="" class="name">
            {{ props.champion.name }}
          </div>
          <div data-v-de17e6dc="" class="title">
            {{ props.champion.title }}
          </div>
        </div>
      </div>
      <div data-v-de17e6dc="" class="tags">
        <div data-v-de17e6dc="" class="tag">
          {{
            props.champion.tags
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
    <div data-v-de17e6dc="" class="body">
      <hr data-v-de17e6dc="" />
      <div data-v-45896cfe="" class="champ-block">
        <div data-v-45896cfe="" class="spells">
          <div data-v-45896cfe="" class="spell">
            <div data-v-45896cfe="" class="img passive">
              <img
                data-v-45896cfe=""
                :src="
                  'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/passive/' +
                  props.champion.passive.image.full
                "
              />
            </div>
            <div data-v-45896cfe="" class="desc">
              {{ cleanDescription(props.champion.passive.description) }}
            </div>
          </div>
          <div
            data-v-45896cfe=""
            class="spell"
            v-for="(spell, index) in props.champion.spells"
            :key="index"
          >
            <div data-v-45896cfe="" class="img">
              <img
                data-v-45896cfe=""
                :src="
                  'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/spell/' +
                  spell.id +
                  '.png'
                "
              />
            </div>
            <div data-v-45896cfe="" class="desc">
              {{ cleanDescription(spell.description) }}
            </div>
          </div>
          <div data-v-45896cfe="" class="break"></div>
        </div>
        <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="info">
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name attack">
            attack
          </div>
          <div
            data-v-5bc51be1=""
            data-v-cbff5ddf-s=""
            class="line attack"
            :style="{ width: props.champion.info[0].attack + '0%' }"
          ></div>
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name magic">
            magic
          </div>
          <div
            data-v-5bc51be1=""
            data-v-cbff5ddf-s=""
            class="line magic"
            :style="{ width: props.champion.info[0].magic + '0%' }"
          ></div>
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name defense">
            defense
          </div>
          <div
            data-v-5bc51be1=""
            data-v-cbff5ddf-s=""
            class="line defense"
            :style="{ width: props.champion.info[0].defense + '0%' }"
          ></div>
          <div data-v-5bc51be1="" data-v-cbff5ddf-s="" class="name difficulty">
            difficulty
          </div>
          <div
            data-v-5bc51be1=""
            data-v-cbff5ddf-s=""
            class="line difficulty"
            :style="{ width: props.champion.info[0].difficulty + '0%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
