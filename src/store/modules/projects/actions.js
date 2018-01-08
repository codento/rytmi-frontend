import api from '../../../api/projects'
import * as types from './mutation-types'

export function fetchProjects ({ commit }) {
  api.getAll().then(response => {
    commit(types.FETCH_PROJECTS, response.data)
  })
}
