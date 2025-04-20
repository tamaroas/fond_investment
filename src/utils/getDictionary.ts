

// We enumerate all dictionaries here for better linting and typescript support

import { Langs } from './langs-config.js'

// We also get the default import for cleaner types
const dictionaries = {
    en: () => import('../translation/en.json').then((module) => module.default),
    fr: () => import('../translation/fr.json').then((module) => module.default),
}

export const getDictionary = async (locale: Langs) =>
    dictionaries[locale]?.() ?? dictionaries.fr()