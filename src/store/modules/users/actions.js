import * as usersApi from '@/utils/api/users'
import { normalize } from 'normalizr'
import { user } from '../../schema'
import { FETCH_USERS, UPDATE_USER, DELETE_USER } from '../../mutation-types'

export const actions = {
  fetchUsers: async ({ commit, state }) => {
    try {
      const users = await usersApi.getUsers()
      commit(FETCH_USERS, normalize(users, [user]).entities.users)
    } catch (error) {
      console.error(error)
    }
  },
  updateUser: async ({ commit, state }, data) => {
    try {
      const { id } = data
      const user = await usersApi.updateUser(id, data)
      commit(UPDATE_USER, user)
      return user
    } catch (error) {
      console.error(error)
    }
  },
  deleteUser: async ({ commit, state }, userId) => {
    try {
      await usersApi.deleteUser(userId)
      commit(DELETE_USER, userId)
    } catch (error) {
      console.error(error)
    }
  }
}
