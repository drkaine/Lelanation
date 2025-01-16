import { describe, it, expect, beforeEach } from 'vitest'
import { Filter } from '../Filter'
import type { Champion } from '@/types/champion'

describe('Filter', () => {
  let filter: Filter

  // Mock des champions pour les tests
  const mockChampions: Champion[] = [
    {
      id: 'Ahri',
      name: 'Ahri',
      tags: ['Mage', 'Assassin'],
    } as Champion,
    {
      id: 'Darius',
      name: 'Darius',
      tags: ['Fighter', 'Tank'],
    } as Champion,
    {
      id: 'Jinx',
      name: 'Jinx',
      tags: ['Marksman'],
    } as Champion,
  ]

  beforeEach(() => {
    filter = new Filter()
    // Override des données de champion pour les tests
    filter.championData = mockChampions
    filter.filteredChampions.value = mockChampions
  })

  describe('filterChampions', () => {
    it('devrait réinitialiser les filtres quand tag est vide', () => {
      filter.selectedTag = ['Mage']
      filter.filterChampions('')
      expect(filter.selectedTag).toEqual([])
      expect(filter.filteredChampions.value).toEqual(mockChampions)
    })

    it('devrait filtrer les champions par tag', () => {
      filter.filterChampions('Mage')
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Ahri')
    })

    it('devrait gérer plusieurs tags', () => {
      filter.filterChampions('Fighter')
      filter.filterChampions('Tank')
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Darius')
    })

    it('devrait retirer un tag si déjà sélectionné', () => {
      filter.filterChampions('Mage')
      filter.filterChampions('Mage')
      expect(filter.selectedTag).toEqual([])
      expect(filter.filteredChampions.value).toEqual(mockChampions)
    })
  })

  describe('filterChampionsByName', () => {
    it('devrait filtrer les champions par nom', () => {
      filter.searchQuery = 'ah'
      filter.filterChampionsByName()
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Ahri')
    })

    it('devrait combiner recherche par nom et tags', () => {
      filter.searchQuery = 'a'
      filter.selectedTag = ['Mage']
      filter.filterChampionsByName()
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Ahri')
    })

    it('devrait retourner tous les champions filtrés par tag si searchQuery est vide', () => {
      filter.selectedTag = ['Fighter']
      filter.searchQuery = ''
      filter.filterChampionsByName()
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Darius')
    })

    it('devrait être insensible à la casse', () => {
      filter.searchQuery = 'JINX'
      filter.filterChampionsByName()
      expect(filter.filteredChampions.value).toHaveLength(1)
      expect(filter.filteredChampions.value[0].name).toBe('Jinx')
    })
  })
})
