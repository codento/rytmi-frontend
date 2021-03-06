import { generateCv, generateCvUrl } from '../../../utils/api/api'
import * as types from '../../mutation-types'

export const actions = {
  updateCvIntroduction ({ commit }, params) {
    commit(types.UPDATE_CV_INTRODUCTION, params)
  },
  updateKeySkills ({ commit }, params) {
    commit(types.UPDATE_KEY_SKILLS, params)
  },
  updateRecentProjects ({ commit }, params) {
    commit(types.UPDATE_RECENT_PROJECTS, params)
  },
  getCvUrl ({ commit }, cvData) {
    commit(types.EXPORT_CV_PENDING, true)
    return new Promise((resolve, reject) => {
      generateCvUrl(cvData)
        .then(response => {
          commit(types.SET_CV_URL, response.data)
          commit(types.EXPORT_CV_PENDING, false)
          resolve()
        }).catch(error => {
          commit(types.EXPORT_CV_PENDING, false)
          reject(error)
        })
    })
  },
  downloadCv ({ commit }, params) {
    commit(types.EXPORT_CV_PENDING, true)
    return new Promise((resolve, reject) => {
      generateCv(params.cvData)
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = params.pdfName
          link.click()
          commit(types.EXPORT_CV_PENDING, false)
          resolve()
        }).catch(err => {
          commit(types.EXPORT_CV_PENDING, false)
          reject(err)
        })
    })
  }
}
