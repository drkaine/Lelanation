<script setup lang="ts">
import { ref, computed } from 'vue'
import items from '@/assets/files/item.json'
import version from '@/assets/files/lastVersion.json'
import ItemTooltip from '@/components/ItemTooltip.vue'

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

const selectedTags = ref<string[]>([])

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (tag === 'all') {
    selectedTags.value = []
  } else if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const filteredItems = computed<Item[]>(() => {
  if (selectedTags.value.length === 0) {
    return Object.values(items.data).filter(
      (item: Item) =>
        item.maps['11'] === true &&
        item.gold?.purchasable === true &&
        item.consumed === undefined &&
        item.gold.total > 0,
    )
  }
  return Object.values(items.data).filter(
    (item: Item) =>
      selectedTags.value.every(tag => item.tags.includes(tag)) &&
      item.maps['11'] === true &&
      item.gold?.purchasable === true &&
      item.gold.total > 0,
  )
})

const itemsBoots = computed<Item[]>(() =>
  filteredItems.value.filter((item: Item) => item.tags?.includes('Boots')),
)

const itemsStarter = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) =>
      (item.depth === undefined && item.tags?.includes('Lane')) ||
      item.tags?.includes('Jungle'),
  ),
)

const itemsBasic = computed<Item[]>(() =>
  filteredItems.value.filter((item: Item) => item.depth === undefined),
)

const itemsEpic = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) => item.depth === 2 && !item.tags?.includes('Boots'),
  ),
)

const itemsLegendary = computed<Item[]>(() =>
  filteredItems.value.filter(
    (item: Item) => item.depth === 3 && !item.tags?.includes('Boots'),
  ),
)
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
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('all')"
          >
            Tous
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('Damage')"
          >
            Attack Damage
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('CriticalStrike')"
          >
            Critical Strike
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('AttackSpeed')"
          >
            Attack Speed
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('OnHit')"
          >
            On-Hit
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('ArmorPenetration')"
          >
            Armor Pen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('SpellDamage')"
          >
            Ability Power
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('Mana')"
          >
            Mana
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('ManaRegen')"
          >
            Mana Regen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('MagicPenetration')"
          >
            Magic Pen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('Health')"
          >
            Health
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('HealthRegen')"
          >
            Health Regen
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('Armor')"
          >
            Armor
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('SpellBlock')"
          >
            Magic Resist
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('AbilityHaste')"
          >
            Ability Haste
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('Movement')"
          >
            Movement
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('LifeSteal')"
          >
            Life Steal
          </button>
          <button
            data-v-27037513=""
            data-v-c8040147=""
            class=""
            @click="toggleTag('SpellVamp')"
          >
            Omnivamp
          </button>
        </div>

        <div data-v-aa396e7d="" class="group type-grid">Starter items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsStarter"
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
            <ItemTooltip
              :item="{
                image: { full: item.image.full },
                name: item.name,
                description: item.description,
                colloq: item.colloq,
                gold: {
                  base: item.gold.base,
                  total: item.gold.total,
                  sell: item.gold.sell,
                },
                tags: item.tags,
                stats: item.stats,
                plaintext: item.plaintext,
              }"
            />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>

        <div data-v-aa396e7d="" class="group type-grid">Basic items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsBasic"
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
            <ItemTooltip
              :item="{
                image: { full: item.image.full },
                name: item.name,
                description: item.description,
                colloq: item.colloq,
                gold: {
                  base: item.gold.base,
                  total: item.gold.total,
                  sell: item.gold.sell,
                },
                tags: item.tags,
                stats: item.stats,
                plaintext: item.plaintext,
              }"
            />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Boots items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsBoots"
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
            <ItemTooltip
              :item="{
                image: { full: item.image.full },
                name: item.name,
                description: item.description,
                colloq: item.colloq,
                gold: {
                  base: item.gold.base,
                  total: item.gold.total,
                  sell: item.gold.sell,
                },
                tags: item.tags,
                stats: item.stats,
                plaintext: item.plaintext,
              }"
            />
          </div>
        </div>
        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Epic items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsEpic"
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
            <ItemTooltip
              :item="{
                image: { full: item.image.full },
                name: item.name,
                description: item.description,
                colloq: item.colloq,
                gold: {
                  base: item.gold.base,
                  total: item.gold.total,
                  sell: item.gold.sell,
                },
                tags: item.tags,
                stats: item.stats,
                plaintext: item.plaintext,
              }"
            />
          </div>
        </div>

        <div data-v-aa396e7d="" class="divider"></div>
        <div data-v-aa396e7d="" class="group type-grid">Legendary items</div>
        <div
          data-v-0ba05451=""
          data-v-8e0e60d7=""
          data-v-aa396e7d=""
          class="tooltip-wrap"
          v-for="(item, index) in itemsLegendary"
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
            <ItemTooltip
              :item="{
                image: { full: item.image.full },
                name: item.name,
                description: item.description,
                colloq: item.colloq,
                gold: {
                  base: item.gold.base,
                  total: item.gold.total,
                  sell: item.gold.sell,
                },
                tags: item.tags,
                stats: item.stats,
                plaintext: item.plaintext,
              }"
            />
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
