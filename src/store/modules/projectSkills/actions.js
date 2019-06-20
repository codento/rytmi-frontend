import * as types from '@/store/mutation-types'
import { insertProjectSkills, deleteProjectSkill, getActiveProjectSkills } from '@/utils/api/api'

export default {
  fetchActiveProjectSkills ({ commit, state }, activeProjectId) {
    if (activeProjectId) {
      return new Promise((resolve, reject) => {
        getActiveProjectSkills(activeProjectId)
          .then(response => {
            commit(types.SET_ACTIVE_PROJECTSKILLS, response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    }
    return []
  },
  addProjectSkill ({ commit, state }, projectSkill) {
    return new Promise((resolve, reject) => {
      insertProjectSkills(projectSkill)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response.data.error)
        })
    })
  },
  removeProjectSkill ({ commit, state }, skill) {
    return new Promise((resolve, reject) => {
      deleteProjectSkill(skill)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error.response.data.error)
        })
    })
  }
}
