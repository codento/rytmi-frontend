import * as types from '../../mutation-types'

export const actions = {
  updateCvIntroduction ({ commit }, params) {
    commit(types.UPDATE_CV_INTRODUCTION, params)
  },
  updateCvOtherInfo ({ commit }, params) {
    commit(types.UPDATE_CV_OTHER_INFO, params)
  },
  updateTopSkills ({ commit }, params) {
    commit(types.UPDATE_TOP_SKILLS, params)
  },
  updateTopProjects ({ commit }, params) {
    commit(types.UPDATE_TOP_PROJECTS, params)
  }
}
