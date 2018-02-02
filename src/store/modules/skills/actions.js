import axios from 'axios'
import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { skills } from '../../schema'

export function fetchSkills ({ commit, state }) {
  axios.get(process.env.API_URL + '/skills')
    .then(response => {
      commit(types.FETCH_SKILLS, normalize(response.data, [skills]).entities.skills)
      commit(types.UPDATE_SKILLLIST)
      console.log(state)
    })
}
