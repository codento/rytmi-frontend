export default {
  profileProjectsStatus: (state) => state.profileProjectsStatus,
  profileProjects: (state) => state.profileProjects,
  profileProjectsByProjectId: (state) => projectId => {
    return Object.values(state.profileProjects).filter(item => item.projectId === projectId)
  },
  profileProjectsByProfileId: (state) => profileId => {
    return Object.values(state.profileProjects).filter(item => item.projectId === profileId)
  }
}
