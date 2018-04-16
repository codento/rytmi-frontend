export const projects = (state) => state.projects

export const projectById = (state) => (id) => state.projects[id]

export const projectFilter = (state) => (param) => {
  if (param === null || param === '') {
    return state.projects
  }
  return state.projects.filter(project => {
    if (project.name) { // && project.projectCode) {
      return project.name.includes(param) // || project.projectCode.includes(param)
    }
    return false
  })
}
