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
    state.projects[project.id] = project
  },
  [types.DELETE_PROJECT] (state, project) {
    state.projects[project.id] = null
  },
  [types.FETCH_PROJECTPROFILES] (state, projectProfiles) {
    Vue.set(state.projectProfiles, projectProfiles.projectId, projectProfiles.profiles)
  },
  [types.FETCH_PROFILESPROJECTS] (state, profileProjects) {
    Vue.set(state.profileProjects, profileProjects.profileId, profileProjects.projects)
  },
  [types.ADD_PROJECTPROFILE] (state, projectProfile) {
    if (!(projectProfile.projectId in state.projectProfiles)) {
      state.projectProfiles[projectProfile.projectId] = []
    }
    if (!(projectProfile.profileId in state.profileProjects)) {
      state.profileProjects[projectProfile.profileId] = []
    }
    state.projectProfiles[projectProfile.projectId].push(projectProfile)
    state.profileProjects[projectProfile.profileId].push(projectProfile)
  },
  [types.UPDATE_PROJECTPROFILE] (state, projectProfile) {
    let projectProfiles = state.projectProfiles[projectProfile.projectId]
    Vue.set(projectProfiles, projectProfile.index, projectProfile)
    Vue.set(state.projectProfiles, projectProfile.projectId, projectProfiles)
  },
  [types.REMOVE_PROJECTPROFILE] (state, projectProfile) {
    const index = state.projectProfiles[projectProfile.projectId].indexOf(projectProfile)
    if (index !== -1) {
      let newProfiles = state.projectProfiles[projectProfile.projectId]
      newProfiles.splice(index, 1)
      Vue.set(state.projectProfiles, projectProfile.projectId, newProfiles)
    }
  }
}
