import {
  newEmployer,
  getEmployers,
  deleteEmployer,
  alterEmployer
} from '../../../utils/api/api'
import * as types from '../../mutation-types'

export function createEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    newEmployer(data)
      .then(response => {
        commit(types.CREATE_EMPLOYER, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function fetchEmployers ({ commit }) {
  return new Promise((resolve, reject) => {
    getEmployers()
      .then(response => {
        commit(types.FETCH_EMPLOYERS, response.data)
        resolve()
      })
      .catch(err => reject(err))
  })
}

export function removeEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    deleteEmployer(data)
      .then(response => {
        commit(types.DELETE_EMPLOYER, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}

export function updateEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    alterEmployer(data)
      .then(response => {
        commit(types.UPDATE_EMPLOYER, response.data)
        resolve(response)
      })
      .catch(err => reject(err))
  })
}
