export default {
  profileProjectsStatus: (state) => state.profileProjectsStatus,
  profileProjectsByProjectId: (state, getters, rootState) => (projectId) => {
    const ppIds = rootState.projects.profileProjectList[projectId] || []
    return ppIds.map(ppId => state.profileProjects[ppId])
  },
  profileProjectsByProfileId: (state, getters, rootState) => (profileId) => {
    const ppIds = rootState.profiles.profileProjectList[profileId] || []
    return ppIds.map(ppId => state.profileProjects[ppId])
  }
}
