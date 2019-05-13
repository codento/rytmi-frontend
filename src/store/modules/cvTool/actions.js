import { generateCv } from '../../../utils/api/api'
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
  },
  resetPDF ({ commit }) {
    commit(types.GET_PDF_SUCCESS, '')
    commit(types.GET_PDF_FAILURE, '')
  },
  downloadCv ({ commit }, params) {
    commit(types.GET_PDF_PENDING)
    return new Promise((resolve, reject) => {
      generateCv(params.cvData)
        .then(response => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = params.pdfName + 'pdf'
          link.click()
          commit(types.GET_PDF_SUCCESS, params.pdfName)
          resolve()
        }).catch(err => {
          commit(types.GET_PDF_FAILURE, err.message)
        })
    })
  }
}
