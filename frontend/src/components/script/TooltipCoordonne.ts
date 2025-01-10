import { ref } from 'vue'

export class TooltipCoordonne {
  public tooltipLeft = ref('0px')
  public tooltipTop = ref('0px')

  public updateMousePosition = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement
    const tooltip = button.nextElementSibling as HTMLElement
    const rect = button.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const scrollY = window.scrollY

    let xPosition = rect.right
    if (xPosition + tooltipRect.width > viewportWidth) {
      xPosition = rect.left - tooltipRect.width
    }

    let yPosition = rect.top + scrollY

    if (yPosition - scrollY + tooltipRect.height > viewportHeight) {
      yPosition = scrollY + viewportHeight - tooltipRect.height
    }

    if (yPosition < scrollY) {
      yPosition = scrollY
    }

    this.tooltipLeft.value = `${xPosition}px`
    this.tooltipTop.value = `${yPosition}px`
  }

  public resetMousePosition = () => {
    this.tooltipLeft.value = '0px'
    this.tooltipTop.value = '0px'
  }
}
