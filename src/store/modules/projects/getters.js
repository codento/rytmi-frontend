export const getProjects = state => state.projects
export const getProjectById = (state) => (id) => {
  return state.projects.find(project => project.id === id)
}
