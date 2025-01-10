import { describe, it, expect } from 'vitest'
import { useDictionary } from '../useDictionary'

describe('useDictionary', () => {
  const mockDictionary = {
    Aatrox: 'Le Darkin',
    Ahri: 'Le Renard',
    Bard: 'Le Gardien',
    Brand: 'La Vengeance',
    Caitlyn: 'Le Sheriff',
  }

  describe('filtrage et pagination', () => {
    it('devrait paginer correctement avec itemsPerPage', () => {
      const { dictionary, paginatedDictionary, currentPage } = useDictionary(2)
      dictionary.value = mockDictionary

      expect(Object.keys(paginatedDictionary.value).length).toBe(2)

      currentPage.value = 2
      expect(Object.keys(paginatedDictionary.value).length).toBe(2)

      currentPage.value = 3
      expect(Object.keys(paginatedDictionary.value).length).toBe(1)
    })

    it('devrait filtrer par lettre', () => {
      const { dictionary, currentLetter, filteredDictionary } = useDictionary(5)
      dictionary.value = mockDictionary

      currentLetter.value = 'A'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(2)
      expect(Object.keys(filteredDictionary.value)).toContain('Aatrox')
      expect(Object.keys(filteredDictionary.value)).toContain('Ahri')

      currentLetter.value = 'B'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(2)
      expect(Object.keys(filteredDictionary.value)).toContain('Bard')
      expect(Object.keys(filteredDictionary.value)).toContain('Brand')
    })

    it('devrait filtrer par recherche', () => {
      const { dictionary, searchQuery, filteredDictionary } = useDictionary(5)
      dictionary.value = mockDictionary

      searchQuery.value = 'dar'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(1)
      expect(Object.keys(filteredDictionary.value)).toContain('Aatrox')

      searchQuery.value = 'Le'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(4)
    })

    it('devrait calculer correctement le nombre total de pages', () => {
      const { dictionary, totalPages } = useDictionary(2)
      dictionary.value = mockDictionary

      expect(totalPages.value).toBe(3)
    })

    it('devrait combiner filtre par lettre et recherche', () => {
      const { dictionary, currentLetter, searchQuery, filteredDictionary } =
        useDictionary(5)
      dictionary.value = mockDictionary

      currentLetter.value = 'B'
      searchQuery.value = 'ven'

      expect(Object.keys(filteredDictionary.value)).toHaveLength(1)
      expect(Object.keys(filteredDictionary.value)).toContain('Brand')
    })

    it('devrait être insensible à la casse', () => {
      const { dictionary, searchQuery, currentLetter, filteredDictionary } =
        useDictionary(5)
      dictionary.value = mockDictionary

      searchQuery.value = 'RENARD'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(1)
      expect(Object.keys(filteredDictionary.value)).toContain('Ahri')

      currentLetter.value = 'a'
      expect(Object.keys(filteredDictionary.value)).toHaveLength(1)
    })
  })
})
