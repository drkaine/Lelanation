<script setup lang="ts">
import { useChampionStore } from '@/stores/championStore'
const championStore = useChampionStore()
</script>

<template>
  <div data-v-af89f54e="" data-v-b6709614="" class="info">
    <form data-v-af89f54e="">
      <label data-v-af89f54e="">
        Name *
        <input data-v-af89f54e="" maxlength="58" type="text" required />
      </label>
      <label data-v-af89f54e="" class="desc">
        Description
        <textarea data-v-af89f54e="" type="text" maxlength="1500"> </textarea>
      </label>
    </form>
  </div>
  <div data-v-b6709614="" class="next">
    <button data-v-b6709614="">Finish</button>
  </div>

  <div
    data-v-636d16e0=""
    data-v-6a781413=""
    class="stats"
    v-if="championStore.selectedChampion?.stats"
  >
    <table>
      <thead>
        <tr>
          <th
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            niveau
          </th>
          <th>0</th>
          <th
            v-for="n in 18"
            :key="n"
            class="list-item"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{ n }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            PV
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.hp }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.hp +
                championStore.selectedChampion?.stats.hpperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.hp +
                    championStore.selectedChampion?.stats.hpperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.hp +
                  championStore.selectedChampion?.stats.hpperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Mana
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.mp }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.mp +
                championStore.selectedChampion?.stats.mpperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.mp +
                    championStore.selectedChampion?.stats.mpperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.mp +
                  championStore.selectedChampion?.stats.mpperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            MS
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.movespeed }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (championStore.selectedChampion?.stats.movespeed)
                .toString()
                .includes('.')
                ? (championStore.selectedChampion?.stats.movespeed).toFixed(2)
                : championStore.selectedChampion?.stats.movespeed
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Armure
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.armor }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.armor +
                championStore.selectedChampion?.stats.armorperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.armor +
                    championStore.selectedChampion?.stats.armorperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.armor +
                  championStore.selectedChampion?.stats.armorperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Résistance
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.spellblock }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.spellblock +
                championStore.selectedChampion?.stats.spellblockperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.spellblock +
                    championStore.selectedChampion?.stats.spellblockperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.spellblock +
                  championStore.selectedChampion?.stats.spellblockperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Range
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.attackrange }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (championStore.selectedChampion?.stats.attackrange)
                .toString()
                .includes('.')
                ? (championStore.selectedChampion?.stats.attackrange).toFixed(2)
                : championStore.selectedChampion?.stats.attackrange
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            PV régen
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.hpregen }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.hpregen +
                championStore.selectedChampion?.stats.hpregenperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.hpregen +
                    championStore.selectedChampion?.stats.hpregenperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.hpregen +
                  championStore.selectedChampion?.stats.hpregenperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Mana régen
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.mpregen }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.mpregen +
                championStore.selectedChampion?.stats.mpregenperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.mpregen +
                    championStore.selectedChampion?.stats.mpregenperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.mpregen +
                  championStore.selectedChampion?.stats.mpregenperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            Critique
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.crit }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.crit +
                championStore.selectedChampion?.stats.critperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.crit +
                    championStore.selectedChampion?.stats.critperlevel * n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.crit +
                  championStore.selectedChampion?.stats.critperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            AD
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.attackdamage }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.attackdamage +
                championStore.selectedChampion?.stats.attackdamageperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.attackdamage +
                    championStore.selectedChampion?.stats.attackdamageperlevel *
                      n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.attackdamage +
                  championStore.selectedChampion?.stats.attackdamageperlevel * n
            }}
          </td>
        </tr>
        <tr>
          <td
            style="
              color: var(--slate-6);
              background: color-mix(
                in srgb,
                var(--slate-2),
                color-mix(in srgb, var(--red), var(--green) 50%) 0%
              );
            "
            class="health value column"
          >
            AS
          </td>
          <td class="list-item">
            {{ championStore.selectedChampion?.stats.attackspeed }}
          </td>
          <td
            v-for="n in 18"
            :key="n"
            :style="
              n % 2 !== 0
                ? {
                    color: 'var(--slate-6)',
                    background: `color-mix(in srgb, var(--slate-2), color-mix(in srgb, var(--red), var(--green) 50%) 0%)`,
                  }
                : {}
            "
          >
            {{
              (
                championStore.selectedChampion?.stats.attackspeed +
                championStore.selectedChampion?.stats.attackspeedperlevel * n
              )
                .toString()
                .includes('.')
                ? (
                    championStore.selectedChampion?.stats.attackspeed +
                    championStore.selectedChampion?.stats.attackspeedperlevel *
                      n
                  ).toFixed(2)
                : championStore.selectedChampion?.stats.attackspeed +
                  championStore.selectedChampion?.stats.attackspeedperlevel * n
            }}
          </td>
        </tr>
      </tbody>
    </table>
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
</template>
