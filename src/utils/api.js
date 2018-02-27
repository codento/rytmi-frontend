import axios from 'axios'

const PATH_AUTH = '/auth'

export function login (token) {
  return axios.post(process.env.API_URL + PATH_AUTH, {id_token: token})
    .then(response => {
      return response
    }).catch(response => {
      console.log('Backend error' + response)
    })
}
