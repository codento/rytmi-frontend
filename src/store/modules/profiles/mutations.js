import Vue from 'vue'
import * as types from '../../mutation-types'
import { startOfToday, startOfDay } from 'date-fns'

export const mutations = {
  [types.FETCH_PROFILES] (state, profiles) {
    state.profiles = profiles
    state.profileList = Object.keys(profiles)
  },
  [types.UPDATE_PROFILELIST] (state) {
    state.profileList = Object.keys(state.profiles)
  },
  [types.CREATE_PROFILE] (state, profile) {
    state.profiles = { ...state.profiles, [profile.id]: profile }
  },
  [types.UPDATE_PROFILE] (state, profile) {
    state.profiles[profile.id] = profile
  },
  [types.FETCH_PROFILESKILLS] (state, profileSkills) {
    state.profileSkills = profileSkills
  },
  [types.ADD_PROFILE_SKILL] (state, profileSkill) {
    state.profileSkills.push(profileSkill)
  },
  [types.UPDATE_PROFILE_SKILL] (state, profileSkill) {
    const profileSkillIndex = state.profileSkills.findIndex(skill => profileSkill.id === skill.id)
    Vue.set(state.profileSkills, profileSkillIndex, profileSkill)
  },
  [types.REMOVE_PROFILE_SKILL] (state, profileSkillId) {
    state.profileSkills = state.profileSkills.filter((skill) => {
      return skill.id !== profileSkillId
    })
  },
  [types.SET_PROFILEID] (state, profileId) {
    state.profileId = parseInt(profileId)
  },
  [types.CLEAR_PROFILEID] (state) {
    state.profileId = undefined
  },
  [types.ADD_PPTOPROFILE] (state, profileProject) {
    if (!(profileProject.profileId in state.profileProjectList)) {
      Vue.set(state.profileProjectList, profileProject.profileId, [])
    }
    const index = state.profileProjectList[profileProject.profileId].indexOf(profileProject.id)
    if (index === -1) {
      state.profileProjectList[profileProject.profileId].push(profileProject.id)
    }
    if (profileProject.endDate == null || startOfDay(profileProject.endDate) >= startOfToday()) {
      if (!(profileProject.profileId in state.futurePpList)) {
        Vue.set(state.futurePpList, profileProject.profileId, [])
      }
      if (state.futurePpList[profileProject.profileId].indexOf(profileProject.id) === -1) {
        state.futurePpList[profileProject.profileId].push(profileProject.id)
      }
    }
  },
  [types.REMOVE_PPFROMPROFILE] (state, profileProject) {
    const index = state.profileProjectList[profileProject.profileId].indexOf(profileProject.id)
    if (index > -1) {
      state.profileProjectList[profileProject.profileId].splice(index, 1)
    }
    const futureIndex = state.futurePpList[profileProject.profileId] ? state.futurePpList[profileProject.profileId].indexOf(profileProject.id) : -1
    if (futureIndex > -1) {
      state.futurePpList[profileProject.profileId].splice(futureIndex, 1)
    }
  }
}
