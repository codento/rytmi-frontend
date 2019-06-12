import Vue from 'vue'
import * as types from '../../mutation-types'

export default {
  [types.PROFILEPROJECTS_SUCCESS] (state) {
    state.profileProjectsStatus = 'success'
  },
  [types.PROFILEPROJECTS_REQUEST] (state) {
    state.profileProjectsStatus = 'loading'
  },
  [types.PROFILEPROJECTS_ERROR] (state) {
    state.profileProjectsStatus = 'error'
  },
  [types.ADD_PROFILEPROJECT] (state, profileProject) {
    Vue.set(state.profileProjects, profileProject.id, profileProject)
  },
  [types.UPDATE_PROFILEPROJECT] (state, profileProject) {
    Vue.set(state.profileProjects, profileProject.id, profileProject)
  },
  [types.REMOVE_PROFILEPROJECT] (state, profileProject) {
    Vue.delete(state.profileProjects, profileProject.id)
  }
}
