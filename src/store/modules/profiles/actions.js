import axios from 'axios'
import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { profile } from '../../schema'

export function fetchProfiles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    axios.get(process.env.API_URL + '/profiles')
      .then(response => {
        commit(types.FETCH_PROFILES, normalize(response.data, [profile]).entities.profiles)
        commit(types.UPDATE_PROFILELIST)
      })
      .catch(err => console.log(err))
  })
}
