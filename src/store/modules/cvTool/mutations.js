import * as types from '../../mutation-types'

export const mutations = {
  [types.UPDATE_CV_INTRODUCTION]: (state, introduction) => {
    state.cvIntroduction = introduction
  },
  [types.UPDATE_KEY_SKILLS]: (state, skills) => {
    state.keySkills = skills
  },
  [types.UPDATE_RECENT_PROJECTS]: (state, projects) => {
    state.recentProjects = projects
  },
  [types.EXPORT_CV_PENDING] (state, boolean) {
    state.cvExportPending = boolean
  }
}
