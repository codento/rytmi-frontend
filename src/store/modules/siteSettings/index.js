import * as types from '@/store/mutation-types'
import { LANGUAGE_ENUM } from '@/utils/constants'

export const state = {
  currentLanguage: LANGUAGE_ENUM.DEFAULT_LANGUAGE,
  now: Date.now()
}

export const getters = {
  currentLanguage: (state) => state.currentLanguage,
  now: (state) => state.now
}

export const actions = {
  changeLanguage ({ commit }, params) {
    commit(types.CHANGE_LANGUAGE, params)
  },
  startNow ({ commit }) {
    setInterval(() => {
      commit(types.UPDATE_NOW, Date.now())
    }, 10000)
  }
}

export const mutations = {
  [types.CHANGE_LANGUAGE]: (state, language) => {
    state.currentLanguage = language
  },
  [types.UPDATE_NOW]: (state, now) => {
    state.now = now
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
