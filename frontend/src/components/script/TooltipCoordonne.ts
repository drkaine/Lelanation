import { ref } from 'vue'

export class TooltipCoordonne {
  public tooltipLeft = ref('0px')
  public tooltipTop = ref('0px')

  public updateMousePosition = (event: MouseEvent) => {
    const tooltipWidth = 200
    const tooltipHeight = 100

    const button = event.currentTarget as HTMLElement
    const rect = button.getBoundingClientRect()

    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY

    this.tooltipLeft.value = x + rect.width + 'px'
    this.tooltipTop.value = y + rect.height / 2 - tooltipHeight / 2 + 'px'

    if (parseInt(this.tooltipLeft.value) + tooltipWidth > window.innerWidth) {
      this.tooltipLeft.value = x - tooltipWidth - 10 + 'px'
    }

    if (parseInt(this.tooltipTop.value) + tooltipHeight > window.innerHeight) {
      this.tooltipTop.value = y - tooltipHeight - 10 + 'px'
    }

    if (parseInt(this.tooltipTop.value) < 0) {
      this.tooltipTop.value = '10px'
    }
  }

  public resetMousePosition = () => {
    this.tooltipLeft.value = '0px'
    this.tooltipTop.value = '0px'
  }
}
