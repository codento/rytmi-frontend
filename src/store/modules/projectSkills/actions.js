import { deleteProjectSkill } from '@/utils/api/api'

export default {
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
