import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile } from '../../schema'
import {
  getProfiles,
  getProfileSkills,
  alterProfile,
  newProfileSkill,
  deleteProfileSkill,
  alterProfileSkill
} from '../../../utils/api'

export const actions = {
  fetchProfiles ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfiles()
        .then(response => {
          commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
        })
        .catch(err => console.log(err))
    })
  },
  fetchProfileSkills ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfileSkills()
        .then(response => {
          commit(types.FETCH_PROFILESKILLS, response.data)
        })
        .catch(err => console.log(err))
    })
  },
  updateProfile ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      alterProfile(data)
        .then(response => {
          commit(types.UPDATE_PROFILE, response.data)
        }).catch(function (error) {
          reject(error)
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
