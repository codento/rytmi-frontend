import * as types from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'

const initialState = {
  projects: []
}

const mutations = {
  [types.FETCH_PROJECTS] (state, projects) {
    state.projects = projects
  }
}

export default {
  state: { ...initialState },
  actions,
  getters,
  mutations
}
