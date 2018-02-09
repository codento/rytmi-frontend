import axios from 'axios'
import { normalize, denormalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile, skill } from '../../schema'

export function fetchProfiles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/profiles')
      .then(response => {
        commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
      })
      .catch(err => console.log(err))
  })
}

export function updateProfile ({ commit, state }, updatedProfile) {
  return new Promise((resolve, reject) => {
    axios.put(process.env.API_URL + '/profiles/' + updatedProfile.id, denormalize(updatedProfile, profile))
      .then(response => {
        commit(types.UPDATE_PROFILE, normalize(response.data, profile).entities.profiles)
      })
      .catch(err => console.log(err))
  })
}

export function fetchProfileSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/profileskills')
      .then(response => {
        commit(types.FETCH_PROFILESKILLS, normalize(response.data, [skill]).entities.skills)
      })
      .catch(err => console.log(err))
  })
}
