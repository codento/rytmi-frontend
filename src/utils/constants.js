const DEFAULT_LANGUAGE = 'fi'
const LANGUAGES = [
  { id: 'fi', label: 'Suomi' },
  { id: 'en', label: 'English' }
]
const LANGUAGE_GROUP_NAME = 'Language'

const LANGUAGE_ENUM = Object.freeze({
  DEFAULT_LANGUAGE,
  LANGUAGE_GROUP_NAME,
  LANGUAGES
})

export default LANGUAGE_ENUM
