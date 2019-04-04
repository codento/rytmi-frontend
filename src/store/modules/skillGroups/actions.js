import * as types from '@/store/mutation-types'
import { normalize } from 'normalizr'
import { skillGroup } from '@/store/schema'
import { getSkillGroups, newSkillGroup } from '@/utils/api/api'

export function fetchSkillGroups ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkillGroups()
      .then(response => {
        commit(types.FETCH_SKILLGROUPS,
          normalize(response.data, [skillGroup]).entities.skillGroups)
        resolve(response.data)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

export function addSkillGroup ({ commit, state }) {
  return new Promise((resolve, reject) => {
    newSkillGroup()
      .then(response => {
        commit(types.ADD_SKILLGROUP, response.data)
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}

export function deleteSkillGroup ({ commit, state }) {
  return new Promise((resolve, reject) => {
    deleteSkillGroup()
      .then(response => {
        commit(types.DELETE_SKILLGROUP, response.data)
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
