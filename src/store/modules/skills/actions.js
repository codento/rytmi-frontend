import { normalize } from 'normalizr'
import * as types from '@/store/mutation-types'
import { skill, skillCategory } from '@/store/schema'
import { getSkills, getSkillCategories, newSkill, alterSkill, deleteSkill as apiDeleteSkill } from '@/utils/api'

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

export function fetchSkillCategories ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkillCategories()
      .then(response => {
        commit(types.FETCH_SKILL_CATEGORIES, normalize(response.data, [skillCategory]).entities.skillCategories)
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

export function deleteSkill ({ commit, state }, id) {
  return new Promise((resolve, reject) => {
    apiDeleteSkill(id)
      .then(response => {
        commit(types.DELETE_SKILL, id)
        resolve(response.data)
      }).catch(error => {
        reject(error.response.data.error)
      })
  })
}
