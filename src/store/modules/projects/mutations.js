import * as types from '../../mutation-types'

export const mutations = {
  [types.CREATE_PROJECT] (state, project) {
    state.projects.push(project)
  },
  [types.FETCH_PROJECTS] (state, projects) {
    state.projects = projects
  }
}
