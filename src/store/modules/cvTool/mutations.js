import * as types from '../../mutation-types'

export const mutations = {
  [types.UPDATE_CV_INTRODUCTION]: (state, introduction) => {
    state.cvIntroduction = introduction
  },
  [types.UPDATE_CV_OTHER_INFO]: (state, otherInfo) => {
    state.cvOtherInfo = otherInfo
  },
  [types.UPDATE_TOP_SKILLS]: (state, skills) => {
    state.topSkills = skills
  },
  [types.UPDATE_TOP_PROJECTS]: (state, projects) => {
    state.topProjects = projects
  }
}
