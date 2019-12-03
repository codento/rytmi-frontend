import {
  FETCH_USERS,
  UPDATE_USER,
  DELETE_USER,
  CREATE_USER
} from '../../mutation-types'

export const mutations = {
  [FETCH_USERS] (state, payload) {
    state.users = payload
  },
  [CREATE_USER] (state, user) {
    state.users = { ...state.users, [user.id]: user }
  },
  [UPDATE_USER] (state, payload) {
    state.users = { ...state.users, [payload.id]: payload }
  },
  [DELETE_USER] (state, id) {
    const { [id]: del, ...withoutUser } = state.users
    state.users = withoutUser
  }
}
