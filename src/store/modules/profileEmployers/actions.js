import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { profileEmployer } from '@/store/schema'
import {
  newProfileEmployer,
  alterProfileEmployer,
  deleteProfileEmployer,
  getProfileEmployers
} from '@/utils/api/api'

export function createProfileEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    newProfileEmployer(data)
      .then(() => {
        fetchProfileEmployers({ commit })
      }).catch(err => reject(err.response))
  })
}

export function fetchProfileEmployers ({ commit }) {
  return new Promise((resolve, reject) => {
    getProfileEmployers()
      .then(response => {
        commit(types.FETCH_PROFILEEMPLOYERS, normalize(response.data, [profileEmployer]).entities.profileEmployers)
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
      })
      .catch(err => reject(err))
  })
}

export function updateProfileEmployer ({ commit }, data) {
  return new Promise((resolve, reject) => {
    alterProfileEmployer(data)
      .then(() => {
        fetchProfileEmployers({ commit })
      })
      .catch(err => reject(err))
  })
}
