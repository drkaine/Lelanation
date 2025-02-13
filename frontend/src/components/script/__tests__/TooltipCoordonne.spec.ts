import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TooltipCoordonne } from '../TooltipCoordonne'

describe('TooltipCoordonne', () => {
  let tooltip: TooltipCoordonne

  beforeEach(() => {
    tooltip = new TooltipCoordonne()

    vi.spyOn(window, 'innerWidth', 'get').mockImplementation(() => 1024)
    vi.spyOn(window, 'innerHeight', 'get').mockImplementation(() => 768)
    vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => 0)
  })

  describe('resetMousePosition', () => {
    it('devrait réinitialiser les positions à 0px', () => {
      tooltip.tooltipLeft.value = '100px'
      tooltip.tooltipTop.value = '100px'

      tooltip.resetMousePosition()

      expect(tooltip.tooltipLeft.value).toBe('0px')
      expect(tooltip.tooltipTop.value).toBe('0px')
    })
  })

  describe('updateMousePosition', () => {
    it('devrait positionner la tooltip à droite par défaut', () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            right: 100,
            left: 0,
            top: 100,
            height: 50,
          }),
          nextElementSibling: {
            getBoundingClientRect: () => ({
              width: 200,
              height: 100,
            }),
          },
        },
      } as unknown as MouseEvent

      tooltip.updateMousePosition(mockEvent)

      expect(tooltip.tooltipLeft.value).toBe('100px')
      expect(tooltip.tooltipTop.value).toBe('100px')
    })

    it('devrait positionner la tooltip à gauche si pas assez de place à droite', () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            right: 900,
            left: 850,
            top: 100,
            height: 50,
          }),
          nextElementSibling: {
            getBoundingClientRect: () => ({
              width: 200,
              height: 100,
            }),
          },
        },
      } as unknown as MouseEvent

      tooltip.updateMousePosition(mockEvent)

      expect(tooltip.tooltipLeft.value).toBe('650px')
      expect(tooltip.tooltipTop.value).toBe('100px')
    })

    it('devrait ajuster la position verticale si dépasse en bas', () => {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            right: 100,
            left: 0,
            top: 700,
            height: 50,
          }),
          nextElementSibling: {
            getBoundingClientRect: () => ({
              width: 200,
              height: 100,
            }),
          },
        },
      } as unknown as MouseEvent

      tooltip.updateMousePosition(mockEvent)

      expect(tooltip.tooltipTop.value).toBe('668px')
    })

    it('devrait prendre en compte le scroll', () => {
      vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => 100)

      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({
            right: 100,
            left: 0,
            top: 100,
            height: 50,
          }),
          nextElementSibling: {
            getBoundingClientRect: () => ({
              width: 200,
              height: 100,
            }),
          },
        },
      } as unknown as MouseEvent

      tooltip.updateMousePosition(mockEvent)

      expect(tooltip.tooltipTop.value).toBe('200px')
    })
  })
})
