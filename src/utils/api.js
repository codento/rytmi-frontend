import axios from 'axios'
import { denormalize } from 'normalizr'
import { profile, skill } from '../store/schema'
import store from '../store'
import * as types from '../store/mutation-types'

const PATH_AUTH = '/auth'
const PATH_SKILLS = '/skills'
const PATH_PROFILES = '/profiles'
const PATH_PROFILESKILLS = '/profileskills'

export function login (token) {
  return axios.post(process.env.API_URL + PATH_AUTH, {id_token: token})
    .then(response => {
      return response
    }).catch(response => {
      console.log('Backend error' + response)
    })
}

export function getSkills (token) {
  return axios.get(process.env.API_URL + PATH_SKILLS).catch(handleError)
}

export function getProfiles (token) {
  return axios.get(process.env.API_URL + PATH_PROFILES).catch(handleError)
}

export function getProfileSkills (token) {
  return axios.get(process.env.API_URL + PATH_PROFILESKILLS).catch(handleError)
}

export function alterProfile (data, token) {
  return axios.put(process.env.API_URL + PATH_PROFILES + '/' + data.id, denormalize(data, [profile])).catch(handleError)
}

export function newProfileSkill (data, token) {
  return axios.post(process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS, denormalize(data, [skill])).catch(handleError)
}

export function deleteProfileSkill (data, token) {
  return axios.delete(process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id).catch(handleError)
}

function handleError (error) {
  if (error.response.status === 401) {
    store.commit(types.AUTH_LOGOUT)
  } else {
    throw new Error(error)
  }
}
