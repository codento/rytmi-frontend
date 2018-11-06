import * as types from '../../mutation-types'
import Vue from 'vue';

export const mutations = {
  [types.FETCH_SKILLS] (state, skills) {
    state.skills = skills
    state.skillList = Object.keys(state.skills)
  },
  [types.ADD_SKILL] (state, skill) {
    //state , identifier ja itse skilli
    Vue.set(state.skills, skill.id, skill)  
  },
  [types.DELETE_SKILL] (state, skill){
    state.skills[skill.id] = null
  }
}
