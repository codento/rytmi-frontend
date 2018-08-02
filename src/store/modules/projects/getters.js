import _ from 'lodash'

export default {
  projects: (state) => state.projects,
  projectById: (state) => (id) => state.projects[id],
  profilesOfProject: (state, getters, rootState) => (projectId) => state.profileProjectList[projectId].map(id => rootState.profileProjects.profileProjects[id]),
  projectFilter: (state) => (filter) => {
    if (filter === null || filter === '') {
      return state.projects
    }
    filter = filter.toLowerCase()

    return _.filter(state.projects, (project, code) => {
      return project.name.toLowerCase().includes(filter) || project.code.toString().includes(filter)
    })
  }
}
