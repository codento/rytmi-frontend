import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { absence } from '@/store/schema'
import {
  getAbsences,
  getAbsencesForProfile,
  newAbsenceForProfile,
  deleteAbsence,
  alterAbsenceForProfile
} from '@/utils/api/api'

export function fetchAbsences ({ commit }, date) {
  return new Promise((resolve, reject) => {
    getAbsences()
      .then(response => {
        commit(types.FETCH_ABSENCES, normalize(response.data, [absence]).entities.absences)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function fetchAbsencesForProfile ({ commit, state }, profileId) {
  return new Promise((resolve, reject) => {
    getAbsencesForProfile(profileId)
      .then(response => {
        commit(types.FETCH_ABSENCES_FOR_PROFILE, { profileId: profileId, data: normalize(response.data, [absence]).entities.absences })
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      }
      )
  })
}

export function addAbsenceForProfile ({ commit, state }, { profileId, data }) {
  return new Promise((resolve, reject) => {
    newAbsenceForProfile({ profileId, data })
      .then(response => {
        commit(types.ADD_ABSENCE, { profileId: profileId, data: response.data })
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function updateAbsenceForProfile ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterAbsenceForProfile(data)
      .then(response => {
        commit(types.UPDATE_ABSENCE, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function removeAbsence ({ commit, dispatch, state }, { profileId, id }) {
  return new Promise((resolve, reject) => {
    deleteAbsence({ profileId: profileId, id: id })
      .then(response => {
        commit(types.DELETE_ABSENCE, { profileId: profileId, id: id })
        resolve()
      }).catch(error => {
        reject(error.response.data.error)
      })
  })
}
