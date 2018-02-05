import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_SKILLS] (state, skills) {
    state.skills = skills
  },
  [types.UPDATE_SKILLLIST] (state) {
    state.skillList = Object.keys(state.skills)
  }
}
