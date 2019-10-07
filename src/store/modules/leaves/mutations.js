import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_LEAVES] (state, leaves) {
    state.leaves = leaves
  },
  [types.ADD_LEAVE] (state, leave) {
    Vue.set(state.leaves, leave.id, leave)
  },
  [types.UPDATE_LEAVE] (state, leave) {
    Vue.set(state.leaves, leave.id, leave)
  },
  [types.DELETE_LEAVE] (state, id) {
    Vue.delete(state.leaves, id)
  }
}
