import {
  getProjectProfiles,
  getProfileProjects,
  newProjectProfile,
  alterProjectProfile,
  deleteProjectProfile,
  newProject,
  getProjects,
  deleteProject,
  alterProject
} from '../../../utils/api'
import * as types from '../../mutation-types'

export function createProject ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newProject(data)
      .then(response => {
        commit(types.UPDATE_PROJECT, response.data)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
  })
}

export function fetchProjects ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getProjects()
      .then(response => {
        commit(types.FETCH_PROJECTS, response.data)
      })
      .catch(err => console.log(err))
  })
}

export function removeProject ({ commit, state }) {
  return new Promise((resolve, reject) => {
    deleteProject()
      .then(response => {
        commit(types.DELETE_PROJECT, response.data)
      })
      .catch(err => console.log(err))
  })
}

export function updateProject ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterProject(data)
      .then(response => {
        commit(types.UPDATE_PROJECT, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function fetchProjectProfiles ({ commit, state }, projectId) {
  return new Promise((resolve, reject) => {
    getProjectProfiles(projectId)
      .then(response => {
        commit(types.FETCH_PROJECTPROFILES, { projectId: projectId, profiles: response.data })
      })
      .catch(err => console.log(err))
  })
}

export function addProjectProfile ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newProjectProfile(data)
      .then(response => {
        commit(types.ADD_PROJECTPROFILE, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function updateProjectProfile ({ commit, state }, projectProfile) {
  return new Promise((resolve, reject) => {
    alterProjectProfile(projectProfile)
      .then(response => {
        response.data.index = projectProfile.index
        commit(types.UPDATE_PROJECTPROFILE, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function removeProjectProfile ({ commit, state }, projectProfile) {
  return new Promise((resolve, reject) => {
    deleteProjectProfile(projectProfile)
      .then(response => {
        commit(types.REMOVE_PROJECTPROFILE, projectProfile)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function fetchProfileProjects ({ commit, state }, profileId) {
  return new Promise((resolve, reject) => {
    getProfileProjects(profileId)
      .then(response => {
        commit(types.FETCH_PROFILESPROJECTS, { profileId: profileId, projects: response.data })
      })
      .catch(err => reject(err))
  })
}
