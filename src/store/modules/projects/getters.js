import _ from 'lodash'

export default {
  projects: (state) => state.projects,
  projectById: (state) => id => state.projects[id],
  projectFilter: (state) => (filterString) => {
    if (filterString === null || filterString === '') {
      return state.projects
    }
    filterString = filterString.toLowerCase()
    const filteredProjects = Object.values(state.projects).filter(project => {
      if (project.code !== null && project.code.toString().includes(filterString)) {
        return true
      }
      if (Object.values(project.name).some(name => name.toLowerCase().includes(filterString))) {
        return true
      }
      return false
    })
    return _.keyBy(filteredProjects, 'id')
  }
}
