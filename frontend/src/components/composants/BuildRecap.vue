<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import SheetBuild from '@/components/composants/SheetBuild.vue'
import { type BuildData } from '@/components/script/type'

const route = useRoute()
const router = useRouter()
const fileName = route.params.fileName as string
const buildData = ref<BuildData | null>(null)

const response = await fetch(`/src/assets/build/${fileName}`)
const data = await response.json()
buildData.value = data

async function deleteBuild() {
  try {
    const response = await fetch(`/api/delete/${fileName}`, {
      method: 'DELETE',
    })

    if (!response.ok) throw new Error('Erreur lors de la suppression')

    router.push('/build')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

function editBuild() {
  router.push({
    path: '/build/edit',
    query: { file: fileName },
  })
}
</script>

<template>
  <main data-v-0c81bdb5="" class="main builds">
    <div data-v-6a3673aa="" data-v-0c81bdb5="" class="build">
      <h1 data-v-6a3673aa="" class="pagetitle">Build</h1>
      <div data-v-6a3673aa="" class="wrap">
        <div data-v-6a3673aa="" class="sheet">
          <div data-v-6a3673aa="" class="el">
            <SheetBuild
              v-if="buildData"
              :version="buildData.version"
              :name="buildData.name"
              :description="buildData.description"
              :champion="buildData.sheet.champion"
              :runes="buildData.sheet.runes"
              :summonners="buildData.sheet.summoners"
              :shards="buildData.sheet.shards"
              :items="buildData.sheet.items"
            />
          </div>
        </div>
        <div data-v-6a3673aa="" class="actions">
          <div data-v-6a3673aa="" class="image">
            <button data-v-6a3673aa="" class="btn small sea">
              <svg
                data-v-6a3673aa=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 8h.01"></path>
                <path
                  d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
                ></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4"></path>
                <path d="M14 14l1 -1c.653 -.629 1.413 -.815 2.13 -.559"></path>
                <path d="M19 16v6"></path>
                <path d="M22 19l-3 3l-3 -3"></path>
              </svg>
              Download image</button
            ><button
              data-v-6a3673aa=""
              class="btn small sea"
              title="Copy to clipboard"
            >
              <svg
                data-v-6a3673aa=""
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 8h.01"></path>
                <path
                  d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7"
                ></path>
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3"></path>
                <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0"></path>
                <path d="M20 21l2 -2l-2 -2"></path>
                <path d="M17 17l-2 2l2 2"></path>
              </svg>
              Copy image
            </button>
          </div>
          <div data-v-6a3673aa="" class="rest">
            <!-- <button data-v-6a3673aa="" class="btn small slate">Duplicate</button> -->
            <button
              data-v-6a3673aa=""
              class="btn small slate"
              @click="deleteBuild"
            >
              Delete
            </button>
            <button
              data-v-6a3673aa=""
              class="btn small slate"
              @click="editBuild"
            >
              Edit
            </button>
          </div>
        </div>
        <div data-v-6a3673aa="" class="hue" title="Color">
          <input data-v-6a3673aa="" type="range" step="any" max="360" min="1" />
        </div>
        <div data-v-6a3673aa="" class="stats">
          <div data-v-636d16e0="" data-v-6a3673aa="" class="stats">
            <div data-v-636d16e0="" class="list">
              <div data-v-636d16e0="" class="labels">
                <div data-v-636d16e0="" class="label column">base</div>
                <div data-v-636d16e0="" class="label column">items</div>
                <div data-v-636d16e0="" class="label column">total</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="Physical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  862<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="Physical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  2480<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="Physical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  4318<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Physical effective health
                </div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="Magical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  818<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="Magical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  3720<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="Magical-effective-health value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  5902<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">
                  Magical effective health
                </div>
              </div>
              <div data-v-636d16e0="" class="list-item">
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
                >
                  620<span data-v-636d16e0="">&nbsp;</span>
                </div>
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
                >
                  1550<span data-v-636d16e0="">&nbsp;</span>
                </div>
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
                >
                  2170<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">health</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  9<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="health-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  9<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">health regen</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  330<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  2300<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  2630<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">mana</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  8<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="mana-regen value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  8<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">mana regen</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  39<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  60<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="armor value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  99<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">armor</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  32<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  140<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-resist value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  172<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">magic resist</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  63<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  135<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-damage value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  198<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">attack damage</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  340<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  27<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="move-speed value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  367<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">move speed</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  150<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-range value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  150<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">attack range</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  50<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="attack-speed:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  50<span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">attack speed (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  125<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-haste value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  125<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">ability haste</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  485<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="ability-power value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  485<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">ability power</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  18<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="lethality value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  18<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">lethality</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  30<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="magic-penetration:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  30<span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">magic penetration (%)</div>
              </div>
              <div data-v-636d16e0="" class="list-item">
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  0<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  20<span data-v-636d16e0="">%</span>
                </div>
                <div
                  data-v-636d16e0=""
                  class="tenacity:% value column"
                  style="
                    background: color-mix(
                      in srgb,
                      var(--slate-2),
                      color-mix(in srgb, var(--red), var(--green) 50%) 0%
                    );
                  "
                >
                  20<span data-v-636d16e0="">%</span>
                </div>
                <div data-v-636d16e0="" class="name">tenacity (%)</div>
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
                  0<span data-v-636d16e0="">&nbsp;</span>
                </div>
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
                  34700<span data-v-636d16e0="">&nbsp;</span>
                </div>
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
                  34700<span data-v-636d16e0="">&nbsp;</span>
                </div>
                <div data-v-636d16e0="" class="name">gold</div>
              </div>
            </div>
            <div data-v-636d16e0="" class="slot">
              <div data-v-5f37b7fd="" data-v-6a3673aa="" class="note">
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
                  <div
                    data-v-cbff5ddf=""
                    class="touch box"
                    style="position: absolute; left: -45px; top: -101px"
                  >
                    <div data-v-cbff5ddf="" class="body">
                      <b data-v-5f37b7fd="" data-v-cbff5ddf-s=""
                        >Combined base and item stats</b
                      ><br data-v-5f37b7fd="" data-v-cbff5ddf-s="" />
                      Item percentage is calculated into the stat,<br
                        data-v-5f37b7fd=""
                        data-v-cbff5ddf-s=""
                      />
                      unless the percentage stat is shown in the table.<br
                        data-v-5f37b7fd=""
                        data-v-cbff5ddf-s=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-v-6a3673aa="" class="levels">
            <div
              data-v-575fc9df=""
              data-v-6a3673aa=""
              class="levels horizontal"
              title="level"
            >
              <button data-v-575fc9df="" class="active level">1</button
              ><button data-v-575fc9df="" class="level">2</button
              ><button data-v-575fc9df="" class="level">3</button
              ><button data-v-575fc9df="" class="level">4</button
              ><button data-v-575fc9df="" class="level">5</button
              ><button data-v-575fc9df="" class="level">6</button
              ><button data-v-575fc9df="" class="level">7</button
              ><button data-v-575fc9df="" class="level">8</button
              ><button data-v-575fc9df="" class="level">9</button
              ><button data-v-575fc9df="" class="level">10</button
              ><button data-v-575fc9df="" class="level">11</button
              ><button data-v-575fc9df="" class="level">12</button
              ><button data-v-575fc9df="" class="level">13</button
              ><button data-v-575fc9df="" class="level">14</button
              ><button data-v-575fc9df="" class="level">15</button
              ><button data-v-575fc9df="" class="level">16</button
              ><button data-v-575fc9df="" class="level">17</button
              ><button data-v-575fc9df="" class="level">18</button>
            </div>
          </div>
          <a data-v-6a3673aa="" href="/pro/champion/gwen" class="pro">
            <div data-v-1f02dc05="" class="champion">
              <img
                data-v-1f02dc05=""
                src="https://peak.sybo.dev/data/img/champions/887.png"
                alt="gwen.name"
              />
            </div>
            Gwen PRO/OTP builds and stats
          </a>
        </div>
      </div>
    </div>
  </main>
</template>
