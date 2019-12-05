import store from '@/store'
import * as types from '@/store/mutation-types'

const currentLanguage = (store) => {
  return store.getters.currentLanguage
}

const getNameReference = (name) => {
  switch (name) {
    case 'categories':
      return 'title'
    case 'skills':
      return 'name'
    default:
      return 'id'
  }
}

export const handleError = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      store.commit(types.AUTH_LOGOUT)
    }
    if (error.response.data.error.message === 'SequelizeForeignKeyConstraintError') {
      const referringItemType = Object.keys(error.response.data.error.details)[0]
      const itemNameReference = getNameReference(referringItemType)
      const referringItems = error.response.data.error.details[referringItemType]
      const readableItems = referringItems
        .map(item => item[itemNameReference][currentLanguage(store)]
          ? item[itemNameReference][currentLanguage(store)]
          : `id: ${item.id}`)
        .reduce((a, b) => `${a}, ${b}`)
      throw new Error(`Error deleting item. Items that refer to it: ${readableItems}`)
    }
  }
  throw error
}
