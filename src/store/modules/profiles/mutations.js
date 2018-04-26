import Vue from 'vue'
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
  },
  [types.ADD_PROFILE_SKILL] (state, profileSkill) {
    Vue.set(state.profileSkills, profileSkill.id, profileSkill)
  },
  [types.UPDATE_PROFILE_SKILL] (state, profileSkill) {
    // TODO: this might be wise to refactor
    state.profileSkills = state.profileSkills.filter((skill) => {
      return skill.id !== profileSkill.id
    })
    Vue.set(state.profileSkills, profileSkill.id, profileSkill)
    state.profileSkills.sort((a, b) => { return a.id - b.id })
  },
  [types.REMOVE_PROFILE_SKILL] (state, profileSkillId) {
    state.profileSkills = state.profileSkills.filter((skill) => {
      return skill.id !== profileSkillId
    })
  },
  [types.SET_PROFILEID] (state, profileId) {
    state.profileId = profileId
  },
  [types.CLEAR_PROFILEID] (state) {
    state.profileId = ''
  }
}
