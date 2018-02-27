import axios from 'axios'
import { setIdToken } from './auth.js'

const PATH_AUTH = '/auth'

export function login (token) {
  axios.post(process.env.API_URL + PATH_AUTH, {id_token: token})
    .then(response => {
      console.log('Backend response' + response.data)
      setIdToken(response.data.token)
    }).catch(response => {
      console.log('Backend response' + response)
    })
}
