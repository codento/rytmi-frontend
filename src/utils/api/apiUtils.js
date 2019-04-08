import axios from 'axios'
import store from '@/store'
import { AUTH_LOGOUT } from '@/store/mutation-types'

function getAuthHeaders () {
  const token = window.localStorage ? window.localStorage.getItem('user-token') || '' : ''
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  }
}

function handleError (error) {
  if (error.response.status === 401) {
    store.commit(AUTH_LOGOUT)
  }
  return error
}

export const get = (path, queryParams = null) => {
  return new Promise((resolve, reject) => {
    const headers = getAuthHeaders()
    axios.get(path, { params: queryParams, headers })
      .then(response => resolve(response.data))
      .catch(error => reject(handleError(error)))
  })
}

export const post = (path, payload) => {
  return new Promise((resolve, reject) => {
    const headers = getAuthHeaders()
    axios.post(path, payload, { headers })
      .then(response => resolve(response.data))
      .catch(error => reject(handleError(error)))
  })
}

export const put = (path, payload) => {
  return new Promise((resolve, reject) => {
    const headers = getAuthHeaders()
    axios.put(path, payload, { headers })
      .then(response => resolve(response.data))
      .catch(error => reject(handleError(error)))
  })
}

export const del = (path) => {
  return new Promise((resolve, reject) => {
    const headers = getAuthHeaders()
    axios.delete(path, { headers })
      .then(response => resolve(response))
      .catch(error => reject(handleError(error)))
  })
}
