import axios from 'axios'
import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { skill } from '../../schema'

export function fetchSkills ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/skills')
      .then(response => {
        commit(types.FETCH_SKILLS, normalize(response.data, [skill]).entities.skills)
        commit(types.UPDATE_SKILLLIST)
      })
      .catch(err => console.log(err))
  })
}
