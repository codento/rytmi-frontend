import axios from 'axios'
import { normalize, denormalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile } from '../../schema'

export function fetchProfiles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/profiles')
      .then(response => {
        commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
        commit(types.UPDATE_PROFILELIST)
      })
      .catch(err => console.log(err))
  })
}

export function updateProfile ({ commit, state }, updatedProfile) {
  return new Promise((resolve, reject) => {
    axios.put(process.env.API_URL + '/profiles/' + updatedProfile.id, denormalize(updatedProfile, profile))
      .then(response => {
        // console.log(denormalize(updatedProfile, profile))
        console.log(normalize(response.data, profile).entities.profiles)
        commit(types.UPDATE_PROFILE, normalize(response.data, profile).entities.profiles)
      })
  })
}
