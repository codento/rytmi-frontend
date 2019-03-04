import * as usersApi from '@/utils/users'
import { normalize } from 'normalizr'
import { user } from '../../schema'
import { FETCH_USERS } from '../../mutation-types'

export const actions = {
  fetchUsers: async ({ commit, state }) => {
    try {
      const users = await usersApi.getUsers()
      commit(FETCH_USERS, normalize(users, [user]).entities.users)
    } catch (error) {
      console.error(error)
    }
  }
}
