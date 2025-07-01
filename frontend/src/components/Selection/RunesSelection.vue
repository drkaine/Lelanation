<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRuneStore } from '@/stores/runeStore'
import { useShardStore } from '@/stores/shardStore'
import { useSummonerStore } from '@/stores/summonerStore'
import i18n, { type I18nInternal } from '@/i18n'

import type { Rune, SubRune } from '@/types/rune'
import type { Shard, ShardColumn } from '@/types/shard'
import type { Summoner } from '@/types/summoner'
import type { TooltipData } from '@/types/tooltip'

const { locale } = useI18n()
const runesData = ref<Rune[]>([])
const summonerData = ref<Summoner[]>([])
const shardsData = ref<ShardColumn>()

const runeStore = useRuneStore()
const shardStore = useShardStore()
const summonerStore = useSummonerStore()

const i18nInstance = i18n as unknown as I18nInternal

const loadData = async () => {
  const currentLocale = i18nInstance.global.locale || 'fr'

  try {
    let runesModule
    let summonerModule

    if (currentLocale === 'en') {
      runesModule = await import('@/assets/files/data/en/runesReforged.json')
      summonerModule = await import('@/assets/files/data/en/summoner.json')
    } else {
      runesModule = await import('@/assets/files/data/runesReforged.json')
      summonerModule = await import('@/assets/files/data/summoner.json')
    }

    runesData.value = runesModule.default

    summonerData.value = Object.values(summonerModule.default.data)
  } catch (error) {
    console.error(
      `[RunesSelection] Failed to load language-specific data for ${currentLocale}:`,
      error,
    )
    try {
      const runesModule = await import('@/assets/files/data/runesReforged.json')
      runesData.value = runesModule.default

      const summonerModule = await import('@/assets/files/data/summoner.json')
      summonerData.value = Object.values(summonerModule.default.data)
    } catch (fallbackError) {
      console.error(
        '[RunesSelection] Fallback loading also failed:',
        fallbackError,
      )
    }
  }

  try {
    const shardsModule = await import('@/assets/files/data-manuel/shards.json')
    shardsData.value = shardsModule.default.data
  } catch (shardError) {
    console.error('[RunesSelection] Failed to load shards data:', shardError)
  }
}

watch(
  () => locale.value,
  () => {
    loadData()
  },
)

onMounted(() => {
  loadData()

  window.addEventListener('languageChanged', () => {
    loadData()
  })
})

const filteredSecondaryRunes = computed(() =>
  runesData.value.filter(
    rune => rune.id !== runeStore.runesSelection.principal?.id,
  ),
)

const filteredSummonerSpells = computed(() =>
  summonerData.value.filter(summoner => summoner.modes.includes('CLASSIC')),
)

const selectedRune = (
  type: 'principal' | 'second',
  groupIndex?: number,
  subRune?: SubRune,
  rune?: Rune,
) => {
  if (groupIndex && subRune) {
    runeStore.setGroupRuneSelection(groupIndex, type, subRune)
  } else if (rune) {
    runeStore.setRuneSelection(type, rune)
  }
  hideTooltip()
}

const selectAndClose = (
  type: 'principal' | 'second',
  index?: number,
  subRune?: SubRune,
  rune?: Rune,
) => {
  if (type === 'second' && index !== undefined) {
    const currentSelections = runeStore.runesSelection.groups
      .map(group => group?.second)
      .filter(Boolean)

    const sameRowIndex = currentSelections.findIndex(selected =>
      runeStore.runesSelection.second?.slots.some(slot =>
        slot.runes.some(
          r =>
            r.id === selected?.id &&
            slot.runes.some(r2 => r2.id === subRune?.id),
        ),
      ),
    )

    if (sameRowIndex !== -1) {
      runeStore.setGroupRuneSelection(
        sameRowIndex,
        'second',
        subRune ? subRune : null,
      )
    } else if (currentSelections.length >= 2) {
      runeStore.setGroupRuneSelection(0, 'second', currentSelections[1])
      runeStore.setGroupRuneSelection(1, 'second', subRune ? subRune : null)
    } else {
      runeStore.setGroupRuneSelection(
        currentSelections.length,
        'second',
        subRune ? subRune : null,
      )
    }
  } else if (type === 'principal' && rune) {
    runeStore.setRuneSelection('principal', rune)
    showPrimarySelector.value = false
  } else if (type === 'principal' && index !== undefined && subRune) {
    runeStore.setGroupRuneSelection(index, 'principal', subRune)
    showPrimarySlotSelector.value = showPrimarySlotSelector.value.map(
      () => false,
    )
  } else {
    selectedRune(type, index, subRune, rune)
  }

  showSecondarySlotSelector.value = [false, false, false]
  showSecondaryKeystoneSelector.value = false
  showPrimarySelector.value = false
  activeSecondaryIndex.value = null
  hideTooltip()
}

const getSelectedRune = (index: number | null) => {
  if (index === 0 || index === null) return runeStore.runesSelection.principal
  return runeStore.runesSelection.groups[index]?.principal || null
}

const getSelectedSecondaryRune = (index: number) => {
  return runeStore.runesSelection.runeSecond[index]
}

const showPrimarySelector = ref(false)
const showSecondarySelector = ref(false)

const showPrimarySlotSelector = ref([false, false, false, false, false])

const showSecondarySlotSelector = ref([false, false, false])

const activeTooltip = ref<TooltipData | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const showTooltip = (data: TooltipData, event: MouseEvent) => {
  activeTooltip.value = data
  tooltipX.value = event.clientX + 15
  tooltipY.value = event.clientY + 15
}

const hideTooltip = () => {
  activeTooltip.value = null
}

const showShardSelector = ref(false)
const activeShardIndex = ref(1)

const toggleShardSelector = (index: number) => {
  activeShardIndex.value = index
  showShardSelector.value = !showShardSelector.value
}

const selectShardAndClose = (shard: Shard) => {
  const type =
    activeShardIndex.value === 1
      ? 'principal'
      : activeShardIndex.value === 2
        ? 'second'
        : 'third'
  shardStore.setShardSelection(type, shard)
  showShardSelector.value = false
  hideTooltip()
}

const getSelectedShardFromStore = (index: number) => {
  const type = index === 1 ? 'principal' : index === 2 ? 'second' : 'third'
  return shardStore.shardsSelection[type]
}

const showSecondaryKeystoneSelector = ref(false)
const activeSecondaryIndex = ref<number | null>(null)

const openSecondaryKeystone = () => {
  showSecondaryKeystoneSelector.value = !showSecondaryKeystoneSelector.value
  showSecondarySlotSelector.value = [false, false, false]
  activeSecondaryIndex.value = null
}

const openSecondarySlot = (index: number) => {
  showSecondarySlotSelector.value = showSecondarySlotSelector.value.map(
    (_, i) => (i === index ? !showSecondarySlotSelector.value[i] : false),
  )
  showSecondaryKeystoneSelector.value = false
  activeSecondaryIndex.value = showSecondarySlotSelector.value[index]
    ? index
    : null
}

const closeSecondarySelectors = () => {
  showSecondaryKeystoneSelector.value = false
  showSecondarySlotSelector.value = [false, false, false]
  activeSecondaryIndex.value = null
  hideTooltip()
}

const showSummonerSelector = ref(false)
const activeSummonerIndex = ref<'principal' | 'second' | null>(null)

const toggleSummonerSelector = (type: 'principal' | 'second') => {
  if (activeSummonerIndex.value === type) {
    showSummonerSelector.value = false
    activeSummonerIndex.value = null
  } else {
    showSummonerSelector.value = true
    activeSummonerIndex.value = type
  }
}

const selectSummonerAndClose = (summoner: Summoner) => {
  if (!activeSummonerIndex.value) return

  const otherType =
    activeSummonerIndex.value === 'principal' ? 'second' : 'principal'
  const otherSummoner = summonerStore.summonerSelection[otherType]

  if (otherSummoner?.id === summoner.id) {
    summonerStore.setSummonerSelection(otherType, null)
  }

  summonerStore.setSummonerSelection(activeSummonerIndex.value, summoner)
  showSummonerSelector.value = false
  activeSummonerIndex.value = null
  hideTooltip()
}

const getSelectedSummoner = (type: 'principal' | 'second') => {
  return summonerStore.summonerSelection[type]
}

const formatDescription = (desc: string) => {
  return desc
    .replace(
      /<lol-uikit-tooltipped-keyword key='([^']+)'>([^<]+)<\/lol-uikit-tooltipped-keyword>/g,
      '<span class="keyword">$2</span>',
    )
    .replace(/<b>([^<]+)<\/b>/g, '<strong>$1</strong>')
}
</script>

<template>
  <div class="runesPage">
    <div class="wrap">
      <div class="runes-primary">
        <div class="column-header">
          <button
            class="header-icon"
            @click="showPrimarySelector = !showPrimarySelector"
          >
            <img
              v-if="runeStore.runesSelection.principal"
              :src="`/assets/icons/runes/${runeStore.runesSelection.principal.id}.png`"
              alt="Rune ${runeStore.runesSelection.principal.id}"
            />
          </button>

          <div v-if="showPrimarySelector" class="runes-selector">
            <button
              v-for="(rune, index) in runesData"
              :key="index"
              @click="selectAndClose('principal', undefined, undefined, rune)"
              :class="{
                'rune-option': true,
                selected: rune.id === runeStore.runesSelection.principal?.id,
                disabled: runeStore.runesSelection.second?.id === rune.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </button>
          </div>

          <div class="header-text">
            <div class="header-title">{{ $t('runes.fundamental') }}</div>
            <div class="header-subtitle">
              {{
                runeStore.runesSelection.principal?.name ||
                $t('runes.fundamental-selection')
              }}
            </div>
          </div>
        </div>

        <div
          v-for="index in 4"
          :key="index"
          class="rune-tier"
          :class="{ 'main-rune': index === 0 }"
        >
          <div
            class="rune-slot"
            @click="
              showPrimarySlotSelector[index] = !showPrimarySlotSelector[index]
            "
            :class="{ selected: getSelectedRune(index) }"
          >
            <img
              v-if="getSelectedRune(index)"
              :src="`/assets/icons/runes/${getSelectedRune(index)?.id}.png`"
              alt="Rune ${getSelectedRune(index)?.id}"
            />
          </div>

          <div
            v-if="
              showPrimarySlotSelector[index] &&
              runeStore.runesSelection.principal
            "
            class="runes-selector-primary"
          >
            <button
              v-for="subrune in runeStore.runesSelection.principal.slots[
                index - 1
              ]?.runes"
              :key="subrune.id"
              @click="selectAndClose('principal', index, subrune)"
              @mouseover="
                showTooltip(
                  { name: subrune.name, shortDesc: subrune.shortDesc },
                  $event,
                )
              "
              @mouseleave="hideTooltip"
              :class="{
                'rune-option': true,
                'rune-used':
                  subrune.id !==
                    runeStore.runesSelection.groups[index]?.principal?.id &&
                  runeStore.runesSelection.groups[index].principal !== null,
                selected:
                  subrune.id ===
                  runeStore.runesSelection.groups[index]?.principal?.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${subrune.id}.png`"
                :alt="subrune.name"
              />
            </button>
          </div>

          <div class="rune-description">
            {{ getSelectedRune(index)?.name || 'Sélectionnez une rune' }}
          </div>
        </div>

        <div class="summoner-spells">
          <div
            v-for="type in ['principal', 'second'] as const"
            :key="type"
            class="summoner-slot"
          >
            <div
              class="rune-slot"
              @click="toggleSummonerSelector(type)"
              :class="{ selected: getSelectedSummoner(type) }"
            >
              <img
                v-if="getSelectedSummoner(type)"
                :src="`/assets/icons/summoners/${getSelectedSummoner(type)?.image.full}`"
                :alt="getSelectedSummoner(type)?.name"
              />
            </div>

            <div
              v-if="showSummonerSelector && activeSummonerIndex === type"
              class="runes-selector summoner-selector"
            >
              <div class="rune-options-container">
                <button
                  v-for="spell in filteredSummonerSpells"
                  :key="spell.id"
                  @click="selectSummonerAndClose(spell)"
                  @mouseover="
                    showTooltip(
                      { name: spell.name, shortDesc: spell.description },
                      $event,
                    )
                  "
                  @mouseleave="hideTooltip"
                  :class="{
                    'rune-option': true,
                    selected: spell.id === getSelectedSummoner(type)?.id,
                    used:
                      spell.id !==
                        getSelectedSummoner(
                          activeSummonerIndex === 'principal'
                            ? 'second'
                            : 'principal',
                        )?.id && getSelectedSummoner('principal') !== null,
                  }"
                >
                  <img
                    :src="`/assets/icons/summoners/${spell.image.full}`"
                    :alt="spell.name"
                  />
                </button>
              </div>
            </div>

            <div class="rune-description">
              {{ getSelectedSummoner(type)?.name || 'Sélectionnez un sort' }}
            </div>
          </div>
        </div>
      </div>

      <div class="runes-secondary">
        <div class="column-header">
          <button class="header-icon" @click="openSecondaryKeystone">
            <img
              v-if="runeStore.runesSelection.second"
              :src="`/assets/icons/runes/${runeStore.runesSelection.second.id}.png`"
              alt="Rune ${runeStore.runesSelection.second.id}"
            />
          </button>

          <div
            v-if="showSecondaryKeystoneSelector"
            class="runes-selector secondary-keystone-selector"
          >
            <button
              v-for="(rune, index) in filteredSecondaryRunes"
              :key="index"
              @click="selectAndClose('second', undefined, undefined, rune)"
              :class="{
                'rune-option': true,
                selected: rune.id === runeStore.runesSelection.second?.id,
                disabled: runeStore.runesSelection.second?.id === rune.id,
              }"
            >
              <img
                :src="`/assets/icons/runes/${rune.id}.png`"
                :alt="rune.name"
              />
            </button>
          </div>

          <div class="header-text">
            <div class="header-title">{{ $t('runes.secondary-branch') }}</div>
            <div class="header-subtitle">
              {{
                runeStore.runesSelection.second?.name ||
                $t('runes.secondary-branch-selection')
              }}
            </div>
          </div>
        </div>

        <div v-for="index in 2" :key="index" class="rune-tier">
          <div class="rune-slot-container">
            <div
              class="rune-slot"
              @click="openSecondarySlot(index)"
              :class="{ selected: getSelectedSecondaryRune(index - 1) }"
            >
              <img
                v-if="getSelectedSecondaryRune(index - 1)"
                :src="`/assets/icons/runes/${getSelectedSecondaryRune(index - 1)?.id}.png`"
                alt="Rune ${getSelectedSecondaryRune(index - 1)?.id}"
              />
            </div>

            <div
              v-if="showSecondarySlotSelector[index]"
              class="runes-selector secondary-slot-selector"
            >
              <div
                v-for="(
                  slot, slotIndex
                ) in runeStore.runesSelection.second?.slots.slice(1, 4) || []"
                :key="`slot-${slotIndex}`"
                class="rune-slot-group"
              >
                <div class="rune-slot-line" v-if="slotIndex > 0"></div>
                <div class="rune-options-container">
                  <button
                    v-for="rune in slot.runes"
                    :key="rune.id"
                    @click="selectAndClose('second', index, rune)"
                    @mouseover="
                      showTooltip(
                        { name: rune.name, shortDesc: rune.shortDesc },
                        $event,
                      )
                    "
                    @mouseleave="hideTooltip"
                    :class="{
                      'rune-option': true,
                      selected:
                        rune.id ===
                        runeStore.runesSelection.groups[index]?.second?.id,
                      'rune-used': runeStore.runesSelection.groups.some(
                        group =>
                          group?.second?.id === rune.id ||
                          (slot.runes.some(r => r.id === group?.second?.id) &&
                            rune.id !==
                              runeStore.runesSelection.groups[index]?.second
                                ?.id),
                      ),
                      active:
                        runeStore.runesSelection.groups[index]?.second?.id ===
                        rune.id,
                    }"
                  >
                    <img
                      :src="`/assets/icons/runes/${rune.id}.png`"
                      :alt="rune.name"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="rune-description">
            {{
              getSelectedSecondaryRune(index - 1)?.name ||
              $t('runes.secondary-rune-selection')
            }}
          </div>
        </div>

        <div class="stat-shards">
          <div v-for="index in 3" :key="'shard-' + index" class="shard-tier">
            <div class="rune-slot-container">
              <div
                class="rune-slot"
                @click="toggleShardSelector(index)"
                :class="{ selected: getSelectedShardFromStore(index) }"
              >
                <img
                  v-if="getSelectedShardFromStore(index)"
                  :src="`/assets/icons/shards/${getSelectedShardFromStore(index)?.image}`"
                  alt="Image"
                />
              </div>

              <div
                v-if="
                  showShardSelector && activeShardIndex === index && shardsData
                "
                class="runes-selector shard-selector"
              >
                <div class="rune-options-container">
                  <button
                    v-for="shard in shardsData[activeShardIndex - 1]"
                    :key="shard.image"
                    @click="selectShardAndClose(shard)"
                    @mouseover="
                      showTooltip(
                        { name: 'Statistique', shortDesc: shard.description },
                        $event,
                      )
                    "
                    @mouseleave="hideTooltip"
                    :class="{
                      'rune-option': true,
                      selected:
                        shard.image ===
                        getSelectedShardFromStore(activeShardIndex)?.image,
                      'rune-used':
                        shard.image !==
                          getSelectedShardFromStore(activeShardIndex)?.image &&
                        getSelectedShardFromStore(activeShardIndex) !== null,
                    }"
                  >
                    <img
                      :src="`/assets/icons/shards/${shard.image}`"
                      :alt="shard.description"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div class="shard-description">
              {{
                getSelectedShardFromStore(index)?.description ||
                $t('runes.stat-selection')
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="activeTooltip"
      class="rune-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <h3>Rune: {{ activeTooltip.name }}</h3>
      <p v-html="formatDescription(activeTooltip.shortDesc)"></p>
    </div>

    <div
      v-if="showSecondarySelector"
      class="selector-overlay"
      @click="closeSecondarySelectors"
    ></div>
  </div>
</template>

<style scoped>
.rune-tooltip .keyword {
  color: var(--color-gold-300);
  font-weight: 600;
}

.rune-tooltip strong {
  color: var(--color-gold-500);
  font-weight: 700;
}

.summoner-spells {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin: 1.5rem 0;
  justify-content: center;
}
.summoner-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.summoner-slot .rune-slot {
  width: 48px;
  height: 48px;
  border: 2px solid var(--color-gold-300);
  border-radius: 50%;
  background: var(--color-blue-500);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border 0.2s;
}
.summoner-slot .rune-slot.selected {
  border-color: var(--color-gold-400);
  background: var(--color-gold-50);
}
.summoner-selector {
  margin-top: 0.5rem;
  background: var(--color-blue-900);
  border: 1.5px solid var(--color-gold-300);
  border-radius: 8px;
  padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 160px;
}
.rune-options-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
.rune-option {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid transparent;
  background: var(--color-blue-400);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border 0.2s,
    background 0.2s;
}
.rune-option.selected {
  border-color: var(--color-gold-300);
  background: var(--color-gold-50);
}
.rune-option.used {
  opacity: 0.5;
}
@media (max-width: 600px) {
  .summoner-spells {
    flex-direction: row;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .summoner-slot {
    gap: 0.25rem;
  }
  .summoner-slot .rune-slot {
    width: 40px;
    height: 40px;
  }
  .summoner-selector {
    min-width: 120px;
    padding: 0.25rem 0.25rem 0.15rem 0.25rem;
  }
  .rune-option {
    width: 36px;
    height: 36px;
  }
}
</style>
