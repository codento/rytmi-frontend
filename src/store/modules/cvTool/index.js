import * as types from '../../mutation-types'

export const state = {
  cvIntroduction: '',
  topSkills: [],
  topProjects: []
}

export const getters = {
  cvIntroduction: (state) => state.cvIntroduction,
  topSkills: (state) => state.topSkills,
  topProjects: (state) => state.topProjects
}

export const actions = {
  updateCvIntroduction ({ commit }, params) {
    commit(types.UPDATE_CV_INTRODUCTION, params)
  },
  updateTopSkills ({ commit }, params) {
    commit(types.UPDATE_TOP_SKILLS, params)
  },
  updateTopProjects ({ commit }, params) {
    commit(types.UPDATE_TOP_PROJECTS, params)
  }
}

export const mutations = {
  [types.UPDATE_CV_INTRODUCTION]: (state, introduction) => {
    state.cvIntroduction = introduction
  },
  [types.UPDATE_TOP_SKILLS]: (state, skills) => {
    state.topSkills = skills
  },
  [types.UPDATE_TOP_PROJECTS]: (state, projects) => {
    state.topProjects = projects
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
