import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_SKILLS] (state, skills) {
    state.skills = skills
    state.skillList = Object.keys(state.skills)
  },
  [types.ADD_SKILL] (state, skill) {
    Vue.set(state.skills, skill.id, skill)
  },
  [types.UPDATE_SKILL] (state, skill) {
    Vue.set(state.skills, skill.id, skill)
  },
  [types.DELETE_SKILL] (state, id) {
    Vue.delete(state.skills, id)
  },
  [types.UPDATE_SKILL_FILTER] (state, selectedSkills) {
    state.skillFilter = selectedSkills
  }
}
