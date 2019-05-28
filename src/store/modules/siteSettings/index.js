import * as types from '../../mutation-types'
import constants from '@/utils/constants'
const { LANGUAGE_ENUM } = constants

export const state = {
  currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE
}

export const getters = {
  currentLanguage: (state) => state.currentLanguage
}

export const actions = {
  changeLanguage ({ commit }, params) {
    commit(types.CHANGE_LANGUAGE, params)
  }
}

export const mutations = {
  [types.CHANGE_LANGUAGE]: (state, language) => {
    state.currentLanguage = language
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
