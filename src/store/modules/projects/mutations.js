import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_PROJECTS] (state, projects) {
    projects.forEach((project) => {
      Vue.set(state.projects, project.id, project)
    })
    state.projectList = Object.keys(projects)
  },
  [types.UPDATE_PROJECT] (state, project) {
    Vue.set(state.projects, project.id, project)
  },
  [types.DELETE_PROJECT] (state, project) {
    state.projects[project.id] = null
  },
  [types.ADD_PPTOPROJECT] (state, profileProject) {
    if (!(profileProject.projectId in state.profileProjectList)) {
      Vue.set(state.profileProjectList, profileProject.projectId, [])
    }
    const index = state.profileProjectList[profileProject.projectId].indexOf(profileProject.id)
    if (index === -1) {
      state.profileProjectList[profileProject.projectId].push(profileProject.id)
    }
  },
  [types.REMOVE_PPFROMPROJECT] (state, profileProject) {
    const index = state.profileProjectList[profileProject.projectId].indexOf(profileProject.id)
    if (index > -1) {
      state.profileProjectList[profileProject.projectId].splice(index, 1)
    }
  }
}
