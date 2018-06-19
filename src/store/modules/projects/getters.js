import _ from 'lodash'

export const projects = (state) => state.projects

export const projectById = (state) => (id) => state.projects[id]

export const projectFilter = (state) => (filter) => {
  if (filter === null || filter === '') {
    return state.projects
  }
  filter = filter.toLowerCase()

  return _.filter(state.projects, (project, code) => {
    return project.name.toLowerCase().includes(filter) || project.code.toString().includes(filter)
  })
}

export const projectProfilesByProjectId = (state) => (projectId) => state.projectProfiles[projectId]

export const profileProjectsByProfileId = (state) => (profileId) => state.profileProjects[profileId]
