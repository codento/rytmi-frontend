import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_SKILLGROUPS] (state, skillGroups) {
    state.skillGroups = skillGroups
    state.skillGroupList = Object.keys(state.skillGroups)
  },
  [types.ADD_SKILLGROUP] (state, skillGroup) {
    Vue.set(state.skillGroups, skillGroup.id, skillGroup)
  },
  [types.UPDATE_SKILLGROUP] (state, skillGroup) {
    Vue.set(state.skillGroups, skillGroup.id, skillGroup)
  },
  [types.DELETE_SKILLGROUP] (state, skillGroup) {
    state.skillGroups[skillGroup.id] = null
  }
}
