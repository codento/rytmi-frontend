import * as types from '@/store/mutation-types'
import { getSkillCategories, newSkillCategory } from '@/utils/api'

export function fetchSkillCategories ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkillCategories()
      .then(response => {
        commit(types.FETCH_SKILLCATEGORIES, response.data)
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
