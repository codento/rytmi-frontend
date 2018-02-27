
import { login } from './api'
require('dotenv').config()

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'

function initClient () {
  /* eslint-disable */
  gapi.client.init({
    /* eslint-enable */
    client_id: process.env.CLIENT_ID,
    cookiepolicy: 'single_host_origin',
    scope: 'profile'
  }).then(function () {
    // Listen for sign-in state changes.
    /* eslint-disable */
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    /* eslint-enable */
  })
}
export function getIdToken () {
  return localStorage.getItem(ID_TOKEN_KEY)
}

export function getAccessToken () {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function clearIdToken () {
  localStorage.removeItem(ID_TOKEN_KEY)
}

function clearAccessToken () {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function updateSigninStatus (isSignedIn) {
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  console.log('isSignedIn', isSignedIn)
}

// Get and store id_token in local storage
export function setIdToken (token) {
  localStorage.setItem(ID_TOKEN_KEY, token)
}

export function loadAuthClient () {
  /* eslint-disable */
  gapi.load ('client:auth2',initClient)
  /* eslint-enable */
}

export function handleLogout () {
  console.log('Logging out')
  /* eslint-disable */
  return gapi.auth2.getAuthInstance().signOut().then(() => {
    clearIdToken()
    clearAccessToken()
  })
  /* eslint-enable */
}
export function handleLogin () {
  console.log('Logging in')
  /* eslint-disable */
  return gapi.auth2.getAuthInstance().signIn()
    .then(response => {
      login(response.Zi.id_token)
    })
  /* eslint-enable */
}
export function isSignedIn () {
  const idToken = getIdToken()
  return !!idToken && !isTokenExpired(idToken)
}

function isTokenExpired (token) {
  const expirationDate = (token)
  return expirationDate < new Date()
}

export function requireAuth (to, from, next) {
  if (!isSignedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
