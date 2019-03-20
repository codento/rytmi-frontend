import * as types from '../../mutation-types'
import Vue from 'vue'

export const mutations = {
  [types.FETCH_EMPLOYEEROLES] (state, employeeRoles) {
    state.employeeRoles = employeeRoles
    state.employeeRoleList = Object.keys(state.employeeRoles)
  },
  [types.ADD_EMPLOYEEROLE] (state, employeeRole) {
    Vue.set(state.employeeRoles, employeeRole.id, employeeRole)
  },
  [types.DELETE_EMPLOYEEROLE] (state, employeeRole) {
    state.employeeRoles[employeeRole.id] = null
  }
}
