import { isEmpty, cloneDeep } from 'lodash'

export const getters = {
  futureProjectsOfProfile: (state, getters, rootState) => (profileId) => {
    const profileProjectIds = state.futurePpList[profileId] || []
    return profileProjectIds
      .map(profileProjectId => rootState.profileProjects.profileProjects[profileProjectId])
  },
  profileId: (state) => state.profileId,
  profiles: (state) => state.profiles,
  profileList: (state) => state.profileList,
  profileById: (state, getters, rootState) => (id) => {
    let profile = cloneDeep(state.profiles[id])
    if (profile && profile.cvDescriptions.length > 0) {
      const descriptions = profile.cvDescriptions.filter(item => item.language === rootState.siteSettings.currentLanguage)
      const introduction = descriptions.find(item => item.type === 'introduction')
      const otherInfo = descriptions.find(item => item.type === 'other')
      if (introduction) { profile = Object.assign(profile, { introduction: introduction.description }) }
      if (otherInfo) { profile = Object.assign(profile, { otherInfo: otherInfo.description }) }
    }
    return profile
  },
  profileByUserId: (state) => (userId) => state.profiles[userId],
  skillProfiles: (state) => state.profileSkills,
  profileSkillsByProfileId: (state, getters) => (profileId) => {
    return state.profileSkills
      .filter(skill => skill.profileId === profileId)
      .sort((a, b) => {
        const nameA = getters.skillName(a.skillId).toLowerCase()
        const nameB = getters.skillName(b.skillId).toLowerCase()
        if (nameA < nameB) return -1
        else if (nameA > nameB) return 1
        return 0
      })
  },
  profileFilter: (state) => (nameFilter) => {
    const profiles = Object.values(state.profiles)
    if (isEmpty(nameFilter)) {
      return profiles.filter(profile => profile.active)
    } else {
      return profiles.filter(profile => {
        let name = profile.firstName + ' ' + profile.lastName
        return (name.toLowerCase().includes(nameFilter.toLowerCase()) && profile.active)
      })
    }
  }
}
