import * as types from '@/store/mutation-types'
import { normalize } from 'normalizr'
import { skillCategory } from '@/store/schema'
import {
  getSkillCategories,
  newSkillCategory,
  alterSkillCategory
} from '@/utils/api/api'

export function fetchSkillCategories ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkillCategories()
      .then(response => {
        commit(types.FETCH_SKILLCATEGORIES,
          normalize(response.data, [skillCategory]).entities.skillCategories)
        resolve(response.data)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

export function addSkillCategory ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    newSkillCategory(data)
      .then(response => {
        commit(types.ADD_SKILLCATEGORY, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function updateSkillCategory ({ commit, state }, data) {
  return new Promise((resolve, reject) => {
    alterSkillCategory(data)
      .then(response => {
        commit(types.UPDATE_SKILLCATEGORY, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}
