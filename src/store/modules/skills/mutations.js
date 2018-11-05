import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_SKILLS] (state, skills) {
    state.skills = skills
    state.skillList = Object.keys(state.skills)
  },
  [types.ADD_SKILL] (state, skills) {
    state.skills = skills
    state
  }
}
