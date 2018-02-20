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

export function fetchProfileSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/profileskills')
      .then(response => {
        commit(types.FETCH_PROFILESKILLS, normalize(response.data, [skill]).entities.skills)
      })
      .catch(err => console.log(err))
  })
}

export function updateProfile ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    axios.put(process.env.API_URL + '/profiles/' + data.id, denormalize(data, [profile]))
      .then(response => {
        commit(types.UPDATE_PROFILE, normalize(response.data, [profile]).entities.profiles)
      }).catch(function (error) {
        reject(error)
      })
  })
}

export function addProfileSkill ({commit, state}, data) {
  return new Promise((resolve, reject) => {
    axios.post(process.env.API_URL + '')
      .then(response => {
        commit(types.ADD_PROFILE_SKILL, 'normalizedData')
      }).catch(error => {
        reject(error)
      })
  })
}
