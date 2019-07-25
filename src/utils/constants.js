const DEFAULT_LANGUAGE = 'fi'
const LANGUAGES = [
  { id: 'fi', label: 'Suomi' },
  { id: 'en', label: 'English' }
]
const LANGUAGE_GROUP_NAME = 'Language'

export const LANGUAGE_ENUM = Object.freeze({
  DEFAULT_LANGUAGE,
  LANGUAGE_GROUP_NAME,
  LANGUAGES
})

export const INTERNAL_COMPANY_NAME = 'Codento Oy'

export const COLORS = {
  orange: '255,132,41',
  violet: '55,47,133',
  pink: '236,82,107',
  violets: ['29,20,51', '19,12,58', '31,26,78', '55,47,133', '74,65,132', '92,90,158', '150,147,193'],
  oranges: ['194,59,0', '214,70,0', '255,117,0', '255,117,0', '255,154,79', '255,176,118', '255,221,196']
}
