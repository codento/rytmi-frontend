import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { skill } from '@/store/schema'
import { getSkills, newSkill, alterSkill, deleteSkill as apiDeleteSkill } from '@/utils/api/api'

export function fetchSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkills()
      .then(response => {
        commit(types.FETCH_SKILLS, normalize(response.data, [skill]).entities.skills)
        resolve(response.data)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      }
      )
  })
}

export function addSkill ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newSkill(data)
      .then(response => {
        commit(types.ADD_SKILL, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function updateSkill ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterSkill(data)
      .then(response => {
        commit(types.UPDATE_SKILL, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
  })
}

export function deleteSkill ({ commit, dispatch, state }, id) {
  return new Promise((resolve, reject) => {
    apiDeleteSkill(id)
      .then(response => {
        commit(types.DELETE_SKILL, id)
        dispatch('fetchProfileSkills')
        resolve(response.data)
      }).catch(error => {
        console.log(error)
        reject(error.response.data.error)
      })
  })
}

export function updateSkillFilter ({ commit, state }, data) {
  commit(types.UPDATE_SKILL_FILTER, data)
}
