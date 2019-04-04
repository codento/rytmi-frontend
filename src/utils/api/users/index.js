import { get, put, del } from '@/utils//api/apiUtils'

const API_URL = process.env.VUE_APP_API_URL
const PATH = API_URL + '/users'

export const getUsers = async () => {
  return get(PATH)
}

export const updateUser = (id, payload) => {
  return put(PATH + '/' + id, payload)
}

export const deleteUser = (id) => {
  return del(PATH + '/' + id)
}
