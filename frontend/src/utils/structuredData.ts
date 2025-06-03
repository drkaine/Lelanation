interface Person {
  '@type': 'Person'
  name: string
  url?: string
  jobTitle?: string
  description?: string
  sameAs?: string[]
}

interface WebSite {
  '@type': 'WebSite'
  '@context': 'https://schema.org'
  name: string
  url: string
  description: string
  potentialAction?: SearchAction
  inLanguage?: string
}

interface SearchAction {
  '@type': 'SearchAction'
  target: string
  'query-input': string
}

interface WebApplication {
  '@type': 'WebApplication'
  '@context': 'https://schema.org'
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers: Offer
  creator: Person
}

interface Offer {
  '@type': 'Offer'
  price: string
  priceCurrency: string
  description?: string
}

export class StructuredDataGenerator {
  private static baseUrl = 'https://www.lelanation.fr'

  static getPerson(): Person {
    return {
      '@type': 'Person',
      name: 'Darkaine',
      url: this.baseUrl,
      jobTitle: 'Développeur',
      description: 'Développeur de Lelanation',
      sameAs: ['https://github.com/drkaine'],
    }
  }

  static getWebSite(): WebSite {
    return {
      '@type': 'WebSite',
      '@context': 'https://schema.org',
      name: 'Lelanation',
      url: this.baseUrl,
      description:
        'Plateforme française de référence pour créer et partager vos builds League of Legends',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/builds-publics?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'fr-FR',
    }
  }

  static getBuildCreatorApp(): WebApplication {
    return {
      '@type': 'WebApplication',
      '@context': 'https://schema.org',
      name: 'Créateur de Build League of Legends',
      description:
        "Outil interactif avancé pour créer des builds optimisés pour League of Legends avec sélection de champions, runes, objets et sorts d'invocateur",
      url: `${this.baseUrl}/build`,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: "Utilisation gratuite de l'outil de création de builds",
      },
      creator: this.getPerson(),
    }
  }

  static getBreadcrumbList(
    items: Array<{ name: string; url: string }>,
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`,
      })),
    }
  }

  static getFAQPage(
    questions: Array<{ question: string; answer: string }>,
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(qa => ({
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.answer,
        },
      })),
    }
  }
}
