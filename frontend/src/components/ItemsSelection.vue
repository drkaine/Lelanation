<script setup lang="ts">
import { ref, onMounted } from 'vue'
import items from '@/assets/files/item.json'
import version from '@/assets/files/lastVersion.json'

interface Item {
  name: string
  description: string
  colloq: string
  plaintext: string
  into?: string[]
  from?: string[]
  consumed?: boolean
  depth?: number
  specialRecipe?: number
  image: Image
  gold: Gold
  tags: string[]
  maps: { [mapId: string]: boolean }
  stats: Stats
}

interface Image {
  full: string
  sprite: string
  group: string
  x: number
  y: number
  w: number
  h: number
}

interface Gold {
  base: number
  purchasable: boolean
  total: number
  sell: number
}

interface Stats {
  [key: string]: number
}

const itemsData = ref<Item[]>([])

onMounted(() => {
  itemsData.value = Object.values(items.data)
})
</script>

<template>
  <div data-v-c3d704f8="" class="main">
    <div data-v-c8040147="" data-v-c3d704f8="" class="items-page">
      <div data-v-aa396e7d="" data-v-c8040147="" class="grid">
        <div data-v-aa396e7d="" class="search">
          <form data-v-c8040147="">
            <label class="small"
              ><input placeholder="Search" type="search"
            /></label>
          </form>
        </div>
        <div data-v-aa396e7d="" class="filter">
          <button data-v-27037513="" data-v-c8040147="" class="">
            Attack Damage</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Critical Strike</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Attack Speed</button
          ><button data-v-27037513="" data-v-c8040147="" class="">On-Hit</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Armor Pen</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Ability Power</button
          ><button data-v-27037513="" data-v-c8040147="" class="">Mana</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Magic Pen</button
          ><button data-v-27037513="" data-v-c8040147="" class="">Health</button
          ><button data-v-27037513="" data-v-c8040147="" class="">Armor</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Magic Resist</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Ability Haste</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Movement</button
          ><button data-v-27037513="" data-v-c8040147="" class="">
            Life Steal &amp; Omnivamp
          </button>
        </div>
        <div data-v-aa396e7d="" class="group type-grid">Starter items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsData"
          :key="index"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                {{ item.gold.total }}
              </div>
            </button>
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Basic items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                src="https://ddragon.leagueoflegends.com/cdn/${version}/img/item/1004.png"
              /><!---->
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                200
              </div></button
            ><!---->
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Boots items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                src="https://ddragon.leagueoflegends.com/cdn/${version}/img/item/1001.png"
              /><!---->
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                300
              </div></button
            ><!---->
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Epic items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                src="https://ddragon.leagueoflegends.com/cdn/${version}/img/item/3866.png"
              /><!---->
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                400
              </div></button
            ><!---->
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Legendary items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
        >
          <div data-v-de17e6dc="" data-v-0ba05451="" class="tooltip">
            <button
              data-v-8e0e60d7=""
              data-v-de17e6dc-s=""
              class="type-grid thumb"
              to="false"
              replace="false"
            >
              <img
                data-v-8e0e60d7=""
                data-v-de17e6dc-s=""
                class="img"
                src="https://ddragon.leagueoflegends.com/cdn/${version}/img/item/3867.png"
              /><!---->
              <div data-v-8e0e60d7="" data-v-de17e6dc-s="" class="gold">
                400
              </div></button
            ><!---->
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
      </div>
    </div>
    <div data-v-c3d704f8="" class="next off">
      <button data-v-c3d704f8="">Next</button>
    </div>
  </div>
</template>
