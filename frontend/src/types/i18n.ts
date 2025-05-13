export interface I18nGlobal {
  global: {
    locale: string
  }
}

export interface MessageStructure {
  [key: string]: string | boolean | undefined
}

export interface LocaleMessages {
  home?: {
    title?: string
  }
  [key: string]: unknown
}
