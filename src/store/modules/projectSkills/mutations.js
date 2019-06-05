import * as types from '../../mutation-types'

export const mutations = {
  [types.SET_ACTIVE_PROJECTSKILLS] (state, projectSkills) {
    state.activeProjectSkills = projectSkills
  }
}
