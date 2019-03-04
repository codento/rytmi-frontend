import { FETCH_USERS } from '../../mutation-types'

export const mutations = {
  [FETCH_USERS] (state, payload) {
    state.users = payload
  }
}
