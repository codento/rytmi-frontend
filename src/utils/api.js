import axios from 'axios'
import { denormalize } from 'normalizr'
import { profile, skill } from '../store/schema'

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
  return axios.get(process.env.API_URL + PATH_SKILLS)
}

export function getProfiles (token) {
  return axios.get(process.env.API_URL + PATH_PROFILES)
}

export function getProfileSkills (token) {
  return axios.get(process.env.API_URL + PATH_PROFILESKILLS)
}

export function alterProfile (data, token) {
  return axios.put(process.env.API_URL + PATH_PROFILES + '/' + data.id, denormalize(data, [profile]))
}

export function newProfileSkill (data, token) {
  return axios.post(process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS, denormalize(data, [skill]))
}

export function deleteProfileSkill (data, token) {
  return axios.delete(process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id)
}
