function addTitle (profileProject, currentLanguage) {
  if (profileProject.descriptions) {
    const descriptions = profileProject.descriptions
      .find(description => description.language === currentLanguage)
    profileProject = Object.assign(profileProject, { title: descriptions.title })
  }
  return profileProject
}

export default {
  profileProjectsStatus: (state) => state.profileProjectsStatus,
  profileProjectsByProjectId: (state, getters, rootState) => (projectId) => {
    const profileProjectIds = rootState.projects.profileProjectList[projectId] || []
    return profileProjectIds.map(profileProjectId => addTitle(
      state.profileProjects[profileProjectId],
      rootState.siteSettings.currentLanguage
    ))
  },
  profileProjectsByProfileId: (state, getters, rootState) => (profileId) => {
    const profileProjectIds = rootState.profiles.profileProjectList[profileId] || []
    return profileProjectIds.map(profileProjectId => addTitle(
      state.profileProjects[profileProjectId],
      rootState.siteSettings.currentLanguage
    ))
  }
}
