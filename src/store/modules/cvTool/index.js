import * as types from '../../mutation-types'

export const state = {
  cvIntroduction: ''
}

export const getters = {
  cvIntroduction: (state) => state.cvIntroduction
}

export const actions = {
  updateCvIntroduction ({ commit }, params) {
    commit(types.UPDATE_CV_INTRODUCTION, params)
  }
}

export const mutations = {
  [types.UPDATE_CV_INTRODUCTION]: (state, introduction) => {
    state.cvIntroduction = introduction
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
