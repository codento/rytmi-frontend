export const projects = (state) => state.projects

export const projectById = (state) => (id) => state.projects[id]

export const projectFilter = (state) => (param) => {
  if (param === null || param === '') {
    return state.projects
  }
  param = param.toLowerCase()
  return state.projects.filter(project => {
    if (project.name && project.code) {
      return project.name.toLowerCase().includes(param) || project.code.toString().includes(param)
    }
    return false
  })
}

export const projectProfilesByProjectId = (state) => (param) => state.projectProfiles[param]
