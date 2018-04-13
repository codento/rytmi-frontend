import { newProject, getProjects, deleteProject, alterProject } from '../../../utils/api'
import * as types from '../../mutation-types'

export function createProject ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newProject(data)
      .then(response => {
        commit(types.CREATE_PROJECT, response.data)
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
      })
      .cath(err => console.log(err))
  })
}
