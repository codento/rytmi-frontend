import * as types from '@/store/mutation-types'
import { normalize } from 'normalizr'
import { employeeRole } from '@/store/schema'
import { getEmployeeRoles, newEmployeeRole, deleteEmployeeRole } from '@/utils/api/api'

export function fetchEmployeeRoles ({ commit, state }) {
  return new Promise((resolve, reject) => {
    getEmployeeRoles()
      .then(response => {
        commit(types.FETCH_EMPLOYEEROLES,
          normalize(response.data, [employeeRole]).entities.employeeRoles)
        resolve(response.data)
      })
      .catch(error => {
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
