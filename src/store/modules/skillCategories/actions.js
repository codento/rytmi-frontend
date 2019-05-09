import * as types from '@/store/mutation-types'
import { normalize } from 'normalizr'
import { skillCategory } from '@/store/schema'
import { getSkillCategories, newSkillCategory } from '@/utils/api/api'

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

export function addSkillCategory ({ commit, state }) {
  return new Promise((resolve, reject) => {
    newSkillCategory()
      .then(response => {
        commit(types.ADD_SKILLCATEGORY, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function deleteSkillCategory ({ commit, state }) {
  return new Promise((resolve, reject) => {
    deleteSkillCategory()
      .then(response => {
        commit(types.DELETE_SKILLCATEGORY, response.data)
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
