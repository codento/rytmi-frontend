import * as types from '@/store/mutation-types'
import { getEmployeeRoles, newEmployeeRole, deleteEmployeeRole } from '@/utils/api'

export function fetchEmployeeRoles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getEmployeeRoles()
      .then(response => {
        commit(types.FETCH_EMPLOYEEROLES, response.data)
        resolve(response.data)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

export function addEmployeeRole ({ commit, state }) {
  return new Promise((resolve, reject) => {
    newEmployeeRole()
      .then(response => {
        commit(types.ADD_EMPLOYEEROLE, response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
  })
}

export function removeEmployeeRole ({ commit, state }) {
  return new Promise((resolve, reject) => {
    deleteEmployeeRole()
      .then(response => {
        commit(types.DELETE_EMPLOYEEROLE, response.data)
        resolve(response.data)
      }).catch(err => {
        reject(err)
      })
  })
}
