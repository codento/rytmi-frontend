import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile } from '../../schema'
import {
  getProfiles,
  getProfileSkills,
  alterProfile,
  newProfileSkill,
  deleteProfileSkill
} from '../../../utils/api'

export function fetchProfiles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getProfiles()
      .then(response => {
        commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
      })
      .catch(err => console.log(err))
  })
}

export function fetchProfileSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getProfileSkills()
      .then(response => {
        commit(types.FETCH_PROFILESKILLS, response.data)
      })
      .catch(err => console.log(err))
  })
}

export const updateProfile = ({ commit, state }, data) => {
  return new Promise((resolve, reject) => {
    alterProfile(data)
      .then(response => {
        const normalized = normalize(response.data, [profile]).entities.profiles
        console.log('normalized', normalized)
        commit(types.UPDATE_PROFILE, response.data)
      }).catch(function (error) {
        reject(error)
      })
  })
}

export function addProfileSkill ({commit, state}, data) {
  return new Promise((resolve, reject) => {
    newProfileSkill(data)
      .then(response => {
        commit(types.ADD_PROFILE_SKILL, response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function removeProfileSkill ({commit, state}, data) {
  return new Promise((resolve, reject) => {
    deleteProfileSkill(data)
      .then(response => {
        commit(types.REMOVE_PROFILE_SKILL, data.id)
      }).catch(error => {
        reject(error)
      })
  })
}
