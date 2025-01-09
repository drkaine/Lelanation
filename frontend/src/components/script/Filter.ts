import type { Ref } from 'vue'
import { ref } from 'vue'
import champions from '@/assets/files/championFull.json'
import type { Champion } from '@/types/champion'

export class Filter {
  public championData: Champion[]
  public selectedTag: string[]
  public filteredChampions: Ref<Champion[]>
  public searchQuery: string

  constructor() {
    this.championData = Object.values(champions.data)
    this.selectedTag = []
    this.filteredChampions = ref(this.championData)
    this.searchQuery = ''
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
