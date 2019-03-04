import { get, put, post, del } from '../apiUtils'

const API_URL = process.env.VUE_APP_API_URL
const PATH = API_URL + '/users'

export const getUsers = async () => {
  const users = await get(PATH)
  return users
}
