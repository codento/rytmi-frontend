import * as types from '../../mutation-types'
import {
  newProfileEmployer,
  alterProfileEmployer,
  deleteProfileEmployer,
  getProfileEmployers
} from '../../../utils/api/api'

export function createProfileEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    newProfileEmployer(data)
      .then((response) => {
        fetchProfileEmployers({ commit })
        resolve(response.data)
      })
      .catch(err => reject(err))
  })
}

export function fetchProfileEmployers ({ commit }) {
  return new Promise((resolve, reject) => {
    getProfileEmployers()
      .then(response => {
        commit(types.FETCH_PROFILEEMPLOYERS, response.data)
        resolve()
      })
      .catch(err => reject(err))
  })
}

export function removeProfileEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    deleteProfileEmployer(data)
      .then(() => {
        fetchProfileEmployers({ commit })
        resolve()
      })
      .catch(err => reject(err))
  })
}

export function updateProfileEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    alterProfileEmployer(data)
      .then(() => {
        fetchProfileEmployers({ commit })
        resolve()
      })
      .catch(err => reject(err))
  })
}
