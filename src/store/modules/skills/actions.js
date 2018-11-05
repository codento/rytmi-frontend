import { normalize } from 'normalizr'
import * as types from '../../mutation-types'
import { skill } from '../../schema'
import { getSkills, newSkill } from '../../../utils/api'


  export function  fetchSkills ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getSkills()
        .then(response => {
          commit(types.FETCH_SKILLS, normalize(response.data, [skill]).entities.skills)
        })
        .catch(err => console.log(err))
    })
  }

export function addSkill ({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      console.log(data)
      newSkill(data)
        .then(response => {
          commit(types.ADD_SKILL, response.data)
        }).catch(error => {
          reject(error)
        })
    })
  }




