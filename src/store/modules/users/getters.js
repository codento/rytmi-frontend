
export const getters = {
  users: (state) => state.users,
  isAdmin: (state, getters) => {
    const { profileId, profileById } = getters
    const profile = profileById(profileId)
    if (Object.keys(state.users).length > 0 && profile) {
      const userProfile = state.users[profile.userId]
      return userProfile.admin
    }
    return false
  }
}
