let idCounter = 0
const componentInstances = new Map<string, number>()

export function generateUniqueId(prefix: string = 'element'): string {
  idCounter++
  return `${prefix}-${idCounter}`
}

export function generateComponentId(
  componentName: string,
  elementType: string = 'element',
): string {
  const key = `${componentName}-${elementType}`
  const currentCount = componentInstances.get(key) || 0
  const newCount = currentCount + 1
  componentInstances.set(key, newCount)

  return `${componentName}-${elementType}-${newCount}`
}

export function generateFormFieldId(
  fieldName: string,
  componentId?: string,
): string {
  const base = componentId ? `${componentId}-${fieldName}` : fieldName
  return generateUniqueId(base)
}

export function generatePageTitleId(title: string, routeName?: string): string {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const route = routeName || 'page'
  return generateUniqueId(`title-${route}-${cleanTitle}`)
}

export function generateChartId(chartType: string = 'chart'): string {
  return generateUniqueId(`chart-${chartType}`)
}

export function useUniqueId(prefix: string = 'vue-element'): string {
  return generateUniqueId(prefix)
}

export function resetIdCounters(): void {
  idCounter = 0
  componentInstances.clear()
}

export interface UniqueIdConfig {
  prefix?: string
  componentName?: string
  elementType?: string
}

export class ComponentIdManager {
  private componentName: string
  private instanceId: string

  constructor(componentName: string) {
    this.componentName = componentName
    this.instanceId = generateUniqueId(componentName)
  }

  generateElementId(elementType: string): string {
    return `${this.instanceId}-${elementType}`
  }

  generateFieldId(fieldName: string): string {
    return `${this.instanceId}-field-${fieldName}`
  }

  getComponentId(): string {
    return this.instanceId
  }
}
