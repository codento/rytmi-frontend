export default {
  profileProjectsStatus: (state) => state.profileProjectsStatus,
  profileProjectsByProjectId: (state, getters, rootState) => (projectId) => {
    const profileProjectIds = rootState.projects.profileProjectList[projectId] || []
    return profileProjectIds.map(profileProjectId => state.profileProjects[profileProjectId])
  },
  profileProjectsByProfileId: (state, getters, rootState) => (profileId) => {
    const profileProjectIds = rootState.profiles.profileProjectList[profileId] || []
    return profileProjectIds.map(profileProjectId => state.profileProjects[profileProjectId])
  }
}
