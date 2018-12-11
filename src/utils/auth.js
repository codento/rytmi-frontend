
export function handleLogout () {
  /* eslint-disable */
  return gapi.auth2.getAuthInstance().signOut()
  /* eslint-enable */
}
