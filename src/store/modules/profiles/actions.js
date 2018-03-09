import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile, skill } from '../../schema'
import { getProfiles, getProfileSkills, alterProfile, newProfileSkill } from '../../../utils/api'

export function fetchProfiles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    console.log('Getting profiles..')
    getProfiles()
      .then(response => {
        commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
      })
      .catch(err => console.log(err))
  })
}

export function fetchProfileSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    console.log('Getting profileSkills..')
    getProfileSkills()
      .then(response => {
        commit(types.FETCH_PROFILESKILLS, response.data)
      })
      .catch(err => console.log(err))
  })
}

export function updateProfile ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    console.log('Updating a profile..')
    alterProfile(data)
      .then(response => {
        commit(types.UPDATE_PROFILE, normalize(response.data, [profile]).entities.profiles)
      }).catch(function (error) {
        reject(error)
      })
  })
}

export function addProfileSkill ({commit, state}, data) {
  return new Promise((resolve, reject) => {
    console.log('Adding a skill to a profile..')
    newProfileSkill(data)
      .then(response => {
        const normalized = normalize(response.data, [skill]).entities.skills
        console.log('Normalized data:' + normalized)
        commit(types.ADD_PROFILE_SKILL, response.data)
      }).catch(error => {
        reject(error)
      })
  })
}
