import {
  newEmployer,
  getEmployers,
  deleteEmployer,
  alterEmployer
} from '../../../utils/api/api'
import * as types from '../../mutation-types'

export function createEmployer ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newEmployer(data)
      .then(response => {
        commit(types.UPDATE_PROJECT, response.data)
        resolve(response)
      }).catch(err => reject(err.response))
  })
}

export function fetchEmployers ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getEmployers()
      .then(response => {
        commit(types.FETCH_PROJECTS, response.data)
        resolve()
      })
      .catch(err => reject(err))
  })
}

export function removeEmployer ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    deleteEmployer(data)
      .then(response => {
        commit(types.DELETE_PROJECT, response.data)
      })
      .catch(err => reject(err))
  })
}

export function updateEmployer ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterEmployer(data)
      .then(response => {
        commit(types.UPDATE_PROJECT, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}
