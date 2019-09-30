import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { leave } from '@/store/schema'
import { getLeaves, newLeave, alterLeave, deleteLeave } from '@/utils/api/api'

export function fetchLeaves ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getLeaves()
      .then(response => {
        commit(types.FETCH_LEAVES, normalize(response.data, [leave]).entities.leaves)
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      }
      )
  })
}

export function addLeave ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newLeave(data)
      .then(response => {
        commit(types.ADD_LEAVE, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function updateLeave ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterLeave(data)
      .then(response => {
        commit(types.UPDATE_LEAVE, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
  })
}

export function removeLeave ({ commit, dispatch, state }, id) {
  return new Promise((resolve, reject) => {
    deleteLeave(id)
      .then(response => {
        commit(types.DELETE_LEAVE, id)
        resolve(response.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
  })
}
