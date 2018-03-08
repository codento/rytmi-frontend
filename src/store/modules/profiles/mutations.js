// import Vue from 'vue'
import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_PROFILES] (state, profiles) {
    state.profiles = profiles
    state.profileList = Object.keys(profiles)
  },
  [types.UPDATE_PROFILELIST] (state) {
    state.profileList = Object.keys(state.profiles)
  },
  [types.UPDATE_PROFILE] (state, profile) {
    state.profiles[profile.id] = profile
  },
  [types.FETCH_PROFILESKILLS] (state, profileSkills) {
    state.profileSkills = profileSkills
    state.profileSkillList = Object.keys(profileSkills)
  },
  [types.ADD_PROFILE_SKILL] (state, profileSkill) {
    console.log(profileSkill)
    state.profileSkills[profileSkill.id] = profileSkill
    state.profileSkillList.push(profileSkill.id)
  },
  [types.CREATE_PROFILE] (state, profile) {
    state.profiles[profile.id] = profile
  },
  [types.SET_PROFILEID] (state, profileId) {
    state.profileId = profileId
  },
  [types.CLEAR_PROFILEID] (state) {
    state.profileId = ''
  }
}
