import {
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
      }).catch(err => reject(err.response))
  })
}

export function fetchProjects ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getProjects()
      .then(response => {
        commit(types.FETCH_PROJECTS, response.data)
        resolve()
      })
      .catch(err => reject(err))
  })
}

export function removeProject ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    deleteProject(data)
      .then(response => {
        commit(types.DELETE_PROJECT, response.data)
      })
      .catch(err => reject(err))
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
