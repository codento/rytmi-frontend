import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_PROFILESKILLS] (state, skills) {
    state.profileskills = skills
    state.skillList = Object.keys(state.skills)
  },
  [types.SET_ACTIVE_PROJECTSKILLS] (state, projectSkills) {
    state.activeProjectSkills = projectSkills
  }
}
