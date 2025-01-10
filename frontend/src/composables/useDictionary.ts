import { ref, computed } from 'vue'

export function useDictionary(itemsPerPage: number) {
  const dictionary = ref<Record<string, string>>({})
  const searchQuery = ref('')
  const currentLetter = ref('')
  const currentPage = ref(1)

  const filteredDictionary = computed(() => {
    let filtered = { ...dictionary.value }

    if (searchQuery.value) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(
          ([key, value]: [string, string]) =>
            key.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            value.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ),
      )
    }

    if (currentLetter.value) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([key]) =>
          key.toLowerCase().startsWith(currentLetter.value.toLowerCase()),
        ),
      )
    }

    return filtered
  })

  const totalPages = computed(() =>
    Math.ceil(Object.keys(filteredDictionary.value).length / itemsPerPage),
  )

  const paginatedDictionary = computed(() => {
    const entries = Object.entries(filteredDictionary.value)
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return Object.fromEntries(entries.slice(start, end))
  })

  return {
    dictionary,
    searchQuery,
    currentLetter,
    currentPage,
    totalPages,
    filteredDictionary,
    paginatedDictionary,
    itemsPerPage,
  }
}
