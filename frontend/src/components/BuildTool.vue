<script setup lang="ts">
import { ref, onMounted } from 'vue'
import champions from '@/assets/files/champion.json'

const searchQuery = ref<string>('')
const championData = ref<
  Array<(typeof champions.data)[keyof typeof champions.data]>
>([])
const filteredChampions = ref<
  Array<(typeof champions.data)[keyof typeof champions.data]>
>([])
const selectedTag = ref<string[]>([])

onMounted(() => {
  championData.value = Object.values(champions.data)
  filteredChampions.value = Object.values(champions.data)
})

const filterChampions = (tag: string) => {
  if (tag === '') {
    filteredChampions.value = championData.value
    selectedTag.value = []
    return
  }

  if (selectedTag.value.includes(tag)) {
    selectedTag.value = selectedTag.value.filter(t => t !== tag)
  } else {
    selectedTag.value.push(tag)
  }

  if (selectedTag.value.length === 0) {
    filteredChampions.value = championData.value
  } else {
    filteredChampions.value = championData.value.filter(champion =>
      selectedTag.value.every(selectedTag =>
        champion.tags.includes(selectedTag),
      ),
    )
  }
}

const filterChampionsByName = () => {
  if (searchQuery.value === '') {
    filteredChampions.value = championData.value.filter(
      champion =>
        selectedTag.value.length === 0 ||
        selectedTag.value.some(tag => champion.tags.includes(tag)),
    )
  } else {
    filteredChampions.value = championData.value.filter(
      champion =>
        champion.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
        (selectedTag.value.length === 0 ||
          selectedTag.value.some(tag => champion.tags.includes(tag))),
    )
  }
}
</script>

<template>
  <div class="app" data-v-f2a5836d="">
    <div class="champions main" data-v-f2a5836d="">
      <div class="build" data-v-f2a5836d="" data-v-c3d704f8="">
        <div data-v-c3d704f8="" class="menu">
          <a
            data-v-c3d704f8=""
            aria-current="page"
            href="/build/champions"
            class="router-link-active router-link-exact-active"
          >
            Champions
          </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/runes" class="">
            <span data-v-c3d704f8="" class="long">
              Runes &amp; Summoner spells</span
            >
            <span data-v-c3d704f8="" class="short"> Runes </span></a
          >
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/items" class=""> Items </a>
          <span data-v-c3d704f8="" class="arrow"></span>
          <a data-v-c3d704f8="" href="/build/info" class=""> Info </a>
        </div>
        <div data-v-c3d704f8="" class="main">
          <div data-v-6024a556="" data-v-c3d704f8="" class="champions">
            <div data-v-6024a556="" class="list">
              <div data-v-6024a556="" class="search">
                <form @submit.prevent data-v-6024a556="">
                  <label class="small">
                    <input
                      placeholder="Search"
                      type="search"
                      v-model="searchQuery"
                      @input="filterChampionsByName"
                    />
                  </label>
                </form>
              </div>
              <div data-v-6024a556="" class="filter">
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Assassin') }"
                  @click="filterChampions('Assassin')"
                >
                  Assassin
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Fighter') }"
                  @click="filterChampions('Fighter')"
                >
                  Combattant
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Mage') }"
                  @click="filterChampions('Mage')"
                >
                  Mage
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Marksman') }"
                  @click="filterChampions('Marksman')"
                >
                  Tireur
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Support') }"
                  @click="filterChampions('Support')"
                >
                  Support
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  :class="{ selected: selectedTag.includes('Tank') }"
                  @click="filterChampions('Tank')"
                >
                  Tank
                </button>
                <button
                  data-v-27037513=""
                  data-v-6024a556=""
                  @click="filterChampions('')"
                >
                  Tous
                </button>
              </div>

              <div
                data-v-de17e6dc=""
                data-v-45896cfe=""
                data-v-6024a556=""
                class="tooltip"
                v-for="(champion, index) in filteredChampions"
                :key="index"
              >
                <button data-v-6024a556="" data-v-de17e6dc-s="" class="champ">
                  <img
                    data-v-6024a556=""
                    data-v-de17e6dc-s=""
                    :src="
                      'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/' +
                      champion.image.full
                    "
                    alt="{{champion.id}}"
                  />
                </button>
                <div data-v-de17e6dc="" class="type-champs box">
                  <div data-v-de17e6dc="" data-v-de17e6dc-s="" class="header">
                    <div data-v-de17e6dc="" data-v-de17e6dc-s="" class="info">
                      <img
                        data-v-de17e6dc=""
                        data-v-de17e6dc-s=""
                        class="img"
                        :src="
                          'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/' +
                          champion.image.full
                        "
                      />
                      <div data-v-de17e6dc="" data-v-de17e6dc-s="" class="text">
                        <div
                          data-v-de17e6dc=""
                          data-v-de17e6dc-s=""
                          class="name"
                        >
                          {{ champion.id }}
                        </div>
                        <div
                          data-v-de17e6dc=""
                          data-v-de17e6dc-s=""
                          class="title"
                        >
                          {{ champion.title }}
                        </div>
                      </div>
                    </div>
                    <div data-v-de17e6dc="" data-v-de17e6dc-s="" class="tags">
                      <div data-v-de17e6dc="" data-v-de17e6dc-s="" class="tag">
                        {{ champion.tags }}
                      </div>
                    </div>
                  </div>
                  <div data-v-de17e6dc="" class="body">
                    <hr data-v-de17e6dc="" />
                    <div
                      data-v-45896cfe=""
                      data-v-de17e6dc-s=""
                      class="champ-block"
                    >
                      <div
                        data-v-45896cfe=""
                        data-v-de17e6dc-s=""
                        class="spells"
                      >
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="spell"
                        >
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="img passive"
                          >
                            <img data-v-45896cfe="" data-v-de17e6dc-s="" />
                            <!-- src="/data/img/champions/spells/266-p.png" -->
                          </div>
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="desc"
                          >
                            Periodically, Aatrox's next basic attack deals bonus
                            <physicaldamage>physical damage</physicaldamage>
                            and heals him, based on the target's max health.
                          </div>
                        </div>
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="spell"
                        >
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="img"
                          >
                            <img data-v-45896cfe="" data-v-de17e6dc-s="" />
                            <!-- src="/data/img/champions/spells/266-0.png" -->
                          </div>
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="desc"
                          >
                            Aatrox slams his greatsword down, dealing physical
                            damage. He can swing three times, each with a
                            different area of effect.
                          </div>
                        </div>
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="spell"
                        >
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="img"
                          >
                            <img data-v-45896cfe="" data-v-de17e6dc-s="" />
                            <!-- src="/data/img/champions/spells/266-1.png" -->
                          </div>
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="desc"
                          >
                            Aatrox smashes the ground, dealing damage to the
                            first enemy hit. Champions and large monsters have
                            to leave the impact area quickly or they will be
                            dragged to the center and take the damage again.
                          </div>
                        </div>
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="spell"
                        >
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="img"
                          >
                            <img data-v-45896cfe="" data-v-de17e6dc-s="" />
                            <!-- src="/data/img/champions/spells/266-2.png" -->
                          </div>
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="desc"
                          >
                            Passively, Aatrox heals when damaging enemy
                            champions. On activation, he dashes in a direction.
                          </div>
                        </div>
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="spell"
                        >
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="img"
                          >
                            <img data-v-45896cfe="" data-v-de17e6dc-s="" />
                            <!-- src="/data/img/champions/spells/266-3.png" -->
                          </div>
                          <div
                            data-v-45896cfe=""
                            data-v-de17e6dc-s=""
                            class="desc"
                          >
                            Aatrox unleashes his demonic form, fearing nearby
                            enemy minions and gaining attack damage, increased
                            healing, and Move Speed. If he gets a takedown, this
                            effect is extended.
                          </div>
                        </div>
                        <div
                          data-v-45896cfe=""
                          data-v-de17e6dc-s=""
                          class="break"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-c3d704f8="" class="sheet champions">
          <div data-v-7a29d415="" data-v-c3d704f8="" class="sheet">
            <div data-v-7a29d415="" class="wrap">
              <div data-v-7a29d415="" class="shadow"></div>
              <div
                data-v-de17e6dc=""
                data-v-45896cfe=""
                data-v-92fb197b=""
                data-v-7a29d415=""
                class="tooltip"
              >
                <div
                  data-v-92fb197b=""
                  data-v-de17e6dc-s=""
                  class="champion hide"
                ></div>
              </div>
              <div data-v-7a29d415="" class="name hide">&nbsp;</div>
              <hr data-v-7a29d415="" class="hide" />
              <hr data-v-7a29d415="" class="hide" />
              <div data-v-7a29d415="" class="itemsGroup">
                <div data-v-7a29d415="" class="items"></div>
                <div data-v-7a29d415="" class="sums hide">
                  <div data-v-7a29d415="" class="hide sum">
                    <div data-v-7a29d415="" class="wrap"></div>
                  </div>
                  <div data-v-7a29d415="" class="hide sum">
                    <div data-v-7a29d415="" class="wrap"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.type-champs {
  display: block;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 5px;
  padding: 10px;
  z-index: 1000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.type-champs box {
  display: block;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 5px;
  padding: 10px;
  z-index: 1000;
}

.type-champs {
  position: relative;
}

.champion-item {
  position: relative;
}
</style>
