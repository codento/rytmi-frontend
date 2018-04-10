import { newProject, getProjects } from '../../../utils/api'
// import { normalize } from 'normalizr'
// import { project } from '../../schema'
import * as types from '../../mutation-types'

export function createProject ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newProject(data)
      .then(response => {
        commit(types.CREATE_PROJECT, response.data)
      }).catch(err => console.log(err))
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
