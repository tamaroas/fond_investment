export const langsConfig = {
    langs: ['en', 'fr'],
    defaultLang: 'fr',
} as const

export type Langs = (typeof langsConfig)['langs'][number]