import axios from 'axios'
import { denormalize } from 'normalizr'
import { profile, skill, project } from '../store/schema'
import store from '../store'
import * as types from '../store/mutation-types'

const PATH_AUTH = '/auth'
const PATH_SKILLS = '/skills'
const PATH_PROFILES = '/profiles'
const PATH_PROFILESKILLS = '/profileskills'
const PATH_PROJECTS = '/projects'
const PATH_PROFILEPROJECTS = '/profileprojects'

export function login (token) {
  return axios.post(process.env.API_URL + PATH_AUTH, {id_token: token})
    .then(response => {
      return response
    }).catch(response => {
      console.log('Backend error' + response)
    })
}

export function getSkills (token) {
  return axios.get(process.env.API_URL + PATH_SKILLS, getAuthHeaders()).catch(handleError)
}

export function getProfiles (token) {
  return axios.get(process.env.API_URL + PATH_PROFILES + '/all', getAuthHeaders()).catch(handleError)
}

export function getProfileSkills (token) {
  return axios.get(process.env.API_URL + PATH_PROFILESKILLS, getAuthHeaders()).catch(handleError)
}

export function alterProfile (data, token) {
  return axios.put(
    process.env.API_URL + PATH_PROFILES + '/' + data.id,
    denormalize(data, [profile]),
    getAuthHeaders())
    .catch(handleError)
}

export function newProfileSkill (data, token) {
  return axios.post(
    process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function alterProfileSkill (data) {
  return axios.put(
    process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProfileSkill (data, token) {
  return axios.delete(
    process.env.API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function newProject (data, token) {
  return axios.post(
    process.env.API_URL + PATH_PROJECTS,
    denormalize(data, [project]),
    getAuthHeaders())
    .catch(handleError)
}

export function alterProject (data, token) {
  return axios.put(
    process.env.API_URL + PATH_PROJECTS + '/' + data.id,
    denormalize(data, [project]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProject (data, token) {
  return axios.delete(
    process.env.API_URL + PATH_PROJECTS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProjects (token) {
  return axios.get(
    process.env.API_URL + PATH_PROJECTS,
    getAuthHeaders())
    .catch(handleError)
}

export function getProjectProfiles (data, token) {
  return axios.get(
    process.env.API_URL + PATH_PROJECTS + '/' + data + '/profiles',
    getAuthHeaders())
    .catch(handleError)
}

export function newProjectProfile (data) {
  return axios.post(
    process.env.API_URL + PATH_PROJECTS + '/' + data.projectId + '/profiles/' + data.profileId,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function alterProjectProfile (data) {
  return axios.put(
    process.env.API_URL + PATH_PROFILEPROJECTS + '/' + data.id,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProjectProfile (data) {
  return axios.delete(
    process.env.API_URL + PATH_PROFILEPROJECTS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProfileProjects (profileId) {
  return axios.get(
    process.env.API_URL + PATH_PROFILES + '/' + profileId + '/projects',
    getAuthHeaders())
    .catch(handleError)
}

function getAuthHeaders () {
  const token = localStorage.getItem('user-token') || ''
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }
}

function handleError (error) {
  if (error.response.status === 401) {
    store.commit(types.AUTH_LOGOUT)
  } else {
    throw error
  }
}
