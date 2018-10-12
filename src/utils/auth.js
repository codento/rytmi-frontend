
function initClient () {
  /* eslint-disable */
  gapi.client.init({
    /* eslint-enable */
    client_id: process.env.VUE_APP_CLIENT_ID,
    cookiepolicy: 'single_host_origin',
    scope: 'profile'
  })
}

export function loadAuthClient () {
  /* eslint-disable */
  gapi.load ('client:auth2',initClient)
  /* eslint-enable */
}

export function handleLogout () {
  /* eslint-disable */
  return gapi.auth2.getAuthInstance().signOut()
  /* eslint-enable */
}
export function handleLogin () {
  /* eslint-disable */
  return gapi.auth2.getAuthInstance().signIn()
  /* eslint-enable */
}
