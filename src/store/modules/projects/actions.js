import axios from 'axios'
import * as types from './mutation-types'

export function fetchProjects ({ commit }) {
  axios.get(process.env.API_URL + 'projects')
      .then(response => {
        commit(types.FETCH_PROJECTS, response.data)
      })
}
