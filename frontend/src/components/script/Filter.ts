import type { Ref } from 'vue'
import { ref } from 'vue'
import type { Champion } from '@/types/champion'
import i18n from '@/i18n'
import { type I18nInternal } from '@/i18n'

export class Filter {
  public championData: Champion[]
  public selectedTag: string[]
  public filteredChampions: Ref<Champion[]>
  public searchQuery: string
  private i18nInstance: I18nInternal

  constructor() {
    this.i18nInstance = i18n as unknown as I18nInternal
    this.championData = []
    this.selectedTag = []
    this.filteredChampions = ref([])
    this.searchQuery = ''
    this.loadChampionData()

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', () => {
        this.loadChampionData()
      })
    }
  }

  public async loadChampionData() {
    const locale = this.i18nInstance.global.locale

    try {
      let championsModule

      if (locale === 'en') {
        championsModule = await import(
          '@/assets/files/data/en/championFull.json'
        )
      } else {
        championsModule = await import('@/assets/files/data/championFull.json')
      }

      this.championData = Object.values(championsModule.default.data)
      this.filteredChampions.value = this.championData
    } catch (error) {
      console.error(`Failed to load champion data for locale ${locale}:`, error)
      try {
        const defaultModule = await import(
          '@/assets/files/data/championFull.json'
        )
        this.championData = Object.values(defaultModule.default.data)
        this.filteredChampions.value = this.championData
      } catch (fallbackError) {
        console.error('Fallback loading also failed:', fallbackError)
      }
    }
  }

  public filterChampions(tag: string): void {
    if (tag === '') {
      this.filteredChampions.value = this.championData
      this.selectedTag = []
      return
    }

    if (this.selectedTag.includes(tag)) {
      this.selectedTag = this.selectedTag.filter(t => t !== tag)
    } else {
      this.selectedTag.push(tag)
    }

    this.filteredChampions.value = this.championData.filter(
      champion =>
        this.selectedTag.length === 0 ||
        this.selectedTag.some(t => champion.tags.includes(t)),
    )
  }

  public filterChampionsByName(): void {
    if (this.searchQuery === '') {
      this.filteredChampions.value = this.championData.filter(
        champion =>
          this.selectedTag.length === 0 ||
          this.selectedTag.some(tag => champion.tags.includes(tag)),
      )
    } else {
      this.filteredChampions.value = this.championData.filter(
        champion =>
          champion.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) &&
          (this.selectedTag.length === 0 ||
            this.selectedTag.some(tag => champion.tags.includes(tag))),
      )
    }
  }
}
