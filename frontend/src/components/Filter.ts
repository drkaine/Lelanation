import type { Ref } from 'vue'
import { ref } from 'vue'
import champions from '@/assets/files/champion.json'

export class Filter {
  public championData: Array<
    (typeof champions.data)[keyof typeof champions.data]
  >
  public selectedTag: string[]
  public filteredChampions: Ref<
    Array<(typeof champions.data)[keyof typeof champions.data]>
  >
  public searchQuery: string

  constructor() {
    this.championData = Object.values(champions.data)
    this.selectedTag = []
    this.filteredChampions = ref(this.championData)
    this.searchQuery = ''
  }

  public filterChampions(tag: string) {
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

    if (this.selectedTag.length === 0) {
      this.filteredChampions.value = this.championData
    } else {
      this.filteredChampions.value = this.championData.filter(champion =>
        this.selectedTag.every(selectedTag =>
          champion.tags.includes(selectedTag),
        ),
      )
    }
  }

  public filterChampionsByName() {
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
