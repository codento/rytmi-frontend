// import Vue from 'vue'
import * as types from '../../mutation-types'

export const mutations = {
  [types.FETCH_PROFILES] (state, profiles) {
    state.profiles = profiles
    state.profileList = Object.keys(profiles)
  },
  [types.UPDATE_PROFILE] (state, profile) {
    state.profiles[profile.id] = profile
  },
  [types.FETCH_PROFILESKILLS] (state, profileSkills) {
    state.profileSkills = profileSkills
    state.profileSkillList = Object.keys(profileSkills)
  }
}
