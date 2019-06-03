import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_SKILLCATEGORIES] (state, skillCategories) {
    state.skillCategories = skillCategories
    state.skillCategoryList = Object.keys(state.skillCategories)
  },
  [types.ADD_SKILLCATEGORY] (state, skillCategory) {
    Vue.set(state.skillCategories, skillCategory.id, skillCategory)
  },
  [types.UPDATE_SKILLCATEGORY] (state, skillCategory) {
    Vue.set(state.skillCategories, skillCategory.id, skillCategory)
  }
}
