import { get, put, del, post } from '@/utils/api/apiUtils'

const API_URL = `${process.env.VUE_APP_BASE_URL}/api`
const PATH = API_URL + '/users'

export const getUsers = async () => {
  return get(PATH)
}

export const createUser = async (payload) => {
  return post(PATH, payload)
}

export const updateUser = (id, payload) => {
  return put(PATH + '/' + id, payload)
}

export const deleteUser = (id) => {
  return del(PATH + '/' + id)
}
