export default {
  projects: (state) => state.projects,
  projectById: (state) => (id) => state.projects[id],
  projectFilter: (state) => (filterString) => {
    if (filterString === null || filterString === '') {
      return state.projects
    }
    filterString = filterString.toLowerCase()
    return Object.values(state.projects).filter(project => {
      if (project.code.toString().includes(filterString)) {
        return true
      }
      for (let i = 0; i < project.descriptions.length; i++) {
        if (project.descriptions[i].name.toLowerCase().includes(filterString)) {
          return true
        }
      }
      return false
    })
  }
}
