import axios from 'axios'
import { denormalize } from 'normalizr'
import { profile, skill, project, employer } from '@/store/schema'
import store from '@/store'
import * as types from '@/store/mutation-types'

const CV_API_URL = `${process.env.VUE_APP_BASE_URL}/cv`
const API_URL = `${process.env.VUE_APP_BASE_URL}/api`
const PATH_AUTH = '/auth'
const PATH_SKILLS = '/skills'
const PATH_PROFILES = '/profiles'
const PATH_PROFILESKILLS = '/profileskills'
const PATH_PROJECTS = '/projects'
const PATH_PROFILEPROJECTS = '/profileprojects'
const PATH_SKILLCATEGORIES = '/skillcategories'
const PATH_SKILLGROUPS = '/skillgroups'
const PATH_EMPLOYEEROLES = '/employeeroles'
const PATH_EMPLOYERS = '/employers'
const PATH_PROFILEEMPLOYERS = '/profileemployers'
const PATH_PROJECTSKILLS = '/projectskills'

export function login (token) {
  return axios.post(API_URL + PATH_AUTH, { id_token: token })
    .then(response => {
      return response
    }).catch(response => {
      console.log('Backend error' + response)
    })
}

export function getVersion () {
  return axios.get(API_URL).catch(handleError)
}

export function getSkills () {
  return axios.get(API_URL + PATH_SKILLS, getAuthHeaders()).catch(handleError)
}

export function newSkill (data) {
  return axios.post(
    API_URL + PATH_SKILLS,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function alterSkill (data) {
  return axios.put(
    API_URL + PATH_SKILLS + '/' + data.id,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteSkill (id) {
  return axios.delete(
    API_URL + PATH_SKILLS + '/' + id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProfiles () {
  return axios.get(API_URL + PATH_PROFILES, getAuthHeaders()).catch(handleError)
}

export function getProfileSkills () {
  return axios.get(API_URL + PATH_PROFILESKILLS, getAuthHeaders()).catch(handleError)
}

export function alterProfile (data) {
  return axios.put(
    API_URL + PATH_PROFILES + '/' + data.id,
    denormalize(data, [profile]),
    getAuthHeaders())
    .catch(handleError)
}

export function newProfileSkill (data) {
  return axios.post(
    API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function alterProfileSkill (data) {
  return axios.put(
    API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id,
    denormalize(data, [skill]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProfileSkill (data) {
  return axios.delete(
    API_URL + PATH_PROFILES + '/' + data.profileId + PATH_SKILLS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function generateCv (data) {
  return axios.post(
    CV_API_URL,
    data,
    {
      responseType: 'blob',
      ...getAuthHeaders()
    })
    .catch(handleError)
}

export function newProject (data) {
  return axios.post(
    API_URL + PATH_PROJECTS,
    denormalize(data, [project]),
    getAuthHeaders())
}

export function alterProject (data) {
  return axios.put(
    API_URL + PATH_PROJECTS + '/' + data.id,
    denormalize(data, [project]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProject (data) {
  return axios.delete(
    API_URL + PATH_PROJECTS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProjects () {
  return axios.get(
    API_URL + PATH_PROJECTS,
    getAuthHeaders())
    .catch(handleError)
}

export function getProfilesOfProject (projectId) {
  return function () {
    return axios.get(
      API_URL + PATH_PROJECTS + '/' + projectId + '/profiles',
      getAuthHeaders())
      .catch(handleError)
  }
}

export function createProjectProfile (data) {
  return axios.post(
    API_URL + PATH_PROJECTS + '/' + data.projectId + '/profiles/' + data.profileId,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function alterProjectProfile (data) {
  return axios.put(
    API_URL + PATH_PROFILEPROJECTS + '/' + data.id,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProjectProfile (data) {
  return axios.delete(
    API_URL + PATH_PROFILEPROJECTS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProjectsOfProfile (profileId) {
  return function () {
    return axios.get(
      API_URL + PATH_PROFILES + '/' + profileId + '/projects',
      getAuthHeaders())
      .catch(handleError)
  }
}

export function getAllFutureProfileProjects () {
  return axios.get(
    API_URL + PATH_PROFILEPROJECTS + '?infuture=true',
    getAuthHeaders())
    .catch(handleError)
}

function getAuthHeaders () {
  const token = window.localStorage ? window.localStorage.getItem('user-token') || '' : ''
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  }
}

export function getSkillCategories () {
  return axios.get(
    API_URL + PATH_SKILLCATEGORIES,
    getAuthHeaders())
    .catch(handleError)
}

export function newSkillCategory (data) {
  return axios.post(
    API_URL + PATH_SKILLCATEGORIES,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function alterSkillCategory (data) {
  return axios.put(
    API_URL + PATH_SKILLCATEGORIES + '/' + data.id,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function getSkillGroups () {
  return axios.get(
    API_URL + PATH_SKILLGROUPS,
    getAuthHeaders())
    .catch(handleError)
}

export function newSkillGroup (data) {
  return axios.post(
    API_URL + PATH_SKILLGROUPS,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function alterSkillGroup (data) {
  return axios.put(
    API_URL + PATH_SKILLGROUPS + '/' + data.id,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function getEmployeeRoles () {
  return axios.get(
    API_URL + PATH_EMPLOYEEROLES,
    getAuthHeaders())
    .catch(handleError)
}

export function newEmployeeRole (data) {
  return axios.post(
    API_URL + PATH_EMPLOYEEROLES,
    data,
    getAuthHeaders())
    .catch(handleError)
}

export function deleteEmployeeRole (id) {
  return axios.delete(
    API_URL + PATH_EMPLOYEEROLES + '/' + id,
    getAuthHeaders())
    .catch(handleError)
}
export function newEmployer (data) {
  return axios.post(
    API_URL + PATH_EMPLOYERS,
    denormalize(data, [employer]),
    getAuthHeaders())
}

export function alterEmployer (data) {
  return axios.put(
    API_URL + PATH_EMPLOYERS + '/' + data.id,
    denormalize(data, [employer]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteEmployer (data) {
  return axios.delete(
    API_URL + PATH_EMPLOYERS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getEmployers () {
  return axios.get(
    API_URL + PATH_EMPLOYERS,
    getAuthHeaders())
    .catch(handleError)
}

export function newProfileEmployer (data) {
  return axios.post(
    API_URL + PATH_PROFILEEMPLOYERS,
    denormalize(data, [employer]),
    getAuthHeaders())
}

export function alterProfileEmployer (data) {
  return axios.put(
    API_URL + PATH_PROFILEEMPLOYERS + '/' + data.id,
    denormalize(data, [employer]),
    getAuthHeaders())
    .catch(handleError)
}

export function deleteProfileEmployer (data) {
  return axios.delete(
    API_URL + PATH_PROFILEEMPLOYERS + '/' + data.id,
    getAuthHeaders())
    .catch(handleError)
}

export function getProfileEmployers () {
  return axios.get(
    API_URL + PATH_PROFILEEMPLOYERS,
    getAuthHeaders())
    .catch(handleError)
}

export function insertProjectSkills (data) {
  return axios.post(
    API_URL + PATH_PROJECTSKILLS + '/',
    data,
    getAuthHeaders())
}

export function deleteProjectSkill (id) {
  return axios.delete(
    API_URL + PATH_PROJECTSKILLS + '/' + id,
    getAuthHeaders())
    .catch(handleError)
}

export function getActiveProjectSkills (id) {
  return axios.get(
    API_URL + PATH_PROJECTSKILLS,
    {
      params: {
        projectId: id
      },
      headers: getAuthHeaders().headers
    }
  ).catch(handleError)
}
function handleError (error) {
  if (error.response) {
    if (error.response.status === 401) {
      store.commit(types.AUTH_LOGOUT)
    }
  } else {
    throw error
  }
}
