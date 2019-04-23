import * as types from '../../mutation-types'
import { newCv } from '@/utils/api/api'

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
  },
  addCV ({ commit }, data) {
    return new Promise((resolve, reject) => {
      newCv(data).then(response => {
        console.log(response)
      })
        .catch(err => reject(err))
    })
  }
}
