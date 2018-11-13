import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { skill } from '../../schema'
import { getSkills } from '../../../utils/api'

export function fetchSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getSkills()
      .then(response => {
        commit(types.FETCH_SKILLS, normalize(response.data, [skill]).entities.skills)
        resolve()
      })
      .catch(err => {
        console.log(err)
        reject(err)
      }
      )
  })
}
