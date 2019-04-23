import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { profile } from '@/store/schema'
import {
  getProfiles,
  getProfileSkills,
  alterProfile,
  newProfileSkill,
  deleteProfileSkill,
  alterProfileSkill
} from '@/utils/api/api'

export const actions = {
  fetchProfiles ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfiles()
        .then(response => {
          commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  fetchProfileSkills ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfileSkills()
        .then(response => {
          commit(types.FETCH_PROFILESKILLS, response.data)
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  updateProfile ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      alterProfile(data)
        .then(response => {
          commit(types.UPDATE_PROFILE, response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error.response.data.error)
        })
    })
  },
  addProfileSkill ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      newProfileSkill(data)
        .then(response => {
          commit(types.ADD_PROFILE_SKILL, response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  removeProfileSkill ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      deleteProfileSkill(data)
        .then(response => {
          commit(types.REMOVE_PROFILE_SKILL, data.id)
        }).catch(error => {
          reject(error)
        })
    })
  },
  updateProfileSkill ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      alterProfileSkill(data)
        .then(response => {
          commit(types.UPDATE_PROFILE_SKILL, response.data)
          resolve(response.data)
        })
        .catch(err => reject(err))
    })
  }
}
