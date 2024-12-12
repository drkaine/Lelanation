<script setup lang="ts">
import version from '@/assets/files/lastVersion.json'
import { useItemStore } from '@/stores/itemStore'

const itemStore = useItemStore()
const getTrad = (name: string) => {
  return statsTrad[name]
}

const removeItem = (index: number) => {
  itemStore.removeItem(index)
}

export interface StatsTrad {
  [key: string]: string
}

const statsTrad: StatsTrad = {
  FlatMagicDamageMod: 'dommage magique',
  FlatCritChanceMod: 'Chance de critique',
  FlatHPRegenMod: 'PV régénération',
  PercentLifeStealMod: '% de vol de vie',
  FlatSpellBlockMod: 'résistance magique',
  FlatMovementSpeedMod: 'vitesse de déplacement',
  FlatArmorMod: 'Armure',
  FlatPhysicalDamageMod: 'dommage physique',
  FlatHPPoolMod: 'PV Pool',
  PercentMovementSpeedMod: '% vitesse de mouvement',
  PercentAttackSpeedMod: "% vitesse d'attaque",
  PercentArmorMod: '% Armure  mod',
  PercentHealthRegenMod: '% PV régénérat,ion mod',
  PercentSpellVamp: '% Spell Vamp',
  PercentLifeSteal: '% vol de vie',
  FlatEnergyRegenMod: 'Energy régénération',
  FlatManaRegenMod: 'Mana régénération',
  FlatMPPoolMod: 'mana Pool',
  FlatAD: 'AD',
  FlatAP: 'AP',
  FlatCooldownReduction: 'Cooldown Reduction',
  PercentCooldownReduction: '% Cooldown Reduction',
  FlatLethality: 'Lethalité',
  FlatOmnivamp: 'Omnivamp',
  PercentOmnivamp: ' % Omnivamp',
  FlatShield: 'bouclier',
  PercentShield: '% bouclier',
  FlatTenacity: 'ténacité',
  PercentTenacity: ' % ténacité',
  FlatSpellVamp: 'Spell Vamp',
  FlatHealthRegen: 'PV régénération',
  PercentHealthRegen: ' % PV régénération',
  FlatArmorPenetration: 'Armure Penetration',
  PercentArmorPenetration: ' % Armure Penetration',
  FlatMagicPenetration: 'Magic Penetration',
  PercentMagicPenetration: ' % Magic Penetration',
  FlatDamageReduction: 'dommage Reduction',
  PercentDamageReduction: '% dommage Reduction',
}
</script>

<template>
  <div data-v-b6709614="" class="extra" id="extra">
    <div data-v-63d61340="" data-v-6a781413="" class="picks">
      <div data-v-63d61340="" class="list">
        <div
          data-v-1875b585=""
          data-v-63d61340=""
          class="pick-item"
          v-for="(item, index) in itemStore.ItemsSelection.core"
          :key="index"
        >
          <div
            data-v-354b7b55=""
            data-v-7ab6e59a=""
            data-v-1875b585=""
            class="tip"
          >
            <button
              data-v-7ab6e59a=""
              to="false"
              class="item"
              replace="false"
              @click="removeItem(index)"
            >
              <img
                data-v-7ab6e59a=""
                class="img"
                :src="`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.image.full}`"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div data-v-6a781413="" class="extra-stats">
      <div data-v-636d16e0="" data-v-6a781413="" class="stats">
        <div data-v-636d16e0="" class="list">
          <div data-v-636d16e0="" class="labels">
            <div data-v-636d16e0="" class="label column">total</div>
          </div>
          <div
            data-v-636d16e0=""
            class="list-item"
            v-for="(stat, index) in itemStore.ItemsStats"
            :key="index"
          >
            <div
              data-v-636d16e0=""
              class="health value column"
              style="
                background: color-mix(
                  in srgb,
                  var(--slate-2),
                  color-mix(in srgb, var(--red), var(--green) 50%) 0%
                );
              "
              v-if="stat && stat > 0"
            >
              {{ stat.toString().includes('.') ? stat.toFixed(2) : stat }}
              <span data-v-636d16e0="">&nbsp; </span>
            </div>
            <div
              data-v-636d16e0=""
              class="name"
              v-if="typeof index === 'string' && stat && stat > 0"
            >
              {{ getTrad(index) }}
            </div>
          </div>
          <div data-v-636d16e0="" class="list-item">
            <div
              data-v-636d16e0=""
              class="gold value column"
              style="
                background: color-mix(
                  in srgb,
                  var(--slate-2),
                  color-mix(in srgb, var(--green), var(--red) 50%) 0%
                );
              "
            >
              {{ itemStore.ItemsGold.total }}
              <span data-v-636d16e0="">&nbsp; </span>
            </div>
            <div data-v-636d16e0="" class="name">gold</div>
          </div>
        </div>
        <div data-v-636d16e0="" class="slot">
          <div data-v-5f37b7fd="" data-v-6a781413="" class="note">
            <div data-v-cbff5ddf="" data-v-5f37b7fd="" class="tooltip">
              <svg
                data-v-5f37b7fd=""
                data-v-cbff5ddf-s=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M12 9h.01"></path>
                <path d="M11 12h1v4h1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
