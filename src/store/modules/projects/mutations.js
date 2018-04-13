import * as types from '../../mutation-types'

export const mutations = {
  [types.CREATE_PROJECT] (state, project) {
    state.projects.push(project)
  },
  [types.FETCH_PROJECTS] (state, projects) {
    state.projects = projects
  },
  [types.UPDATE_PROJECT] (state, project) {
    state.projects[project.id] = project
  },
  [types.DELETE_PROJECT] (state, project) {
    state.projects[project.id] = null
  }
}
