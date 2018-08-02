import * as types from '../../mutation-types'
import {
  getAllFutureProfileProjects,
  getProjectsOfProfile,
  createProjectProfile,
  alterProjectProfile,
  deleteProjectProfile,
  getProfilesOfProject
} from '../../../utils/api'

export default {
  newProjectProfile ({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      createProjectProfile(data)
        .then(response => {
          const profileProject = response.data
          dispatch('addProfileProject', profileProject)
          resolve(response)
        })
        .catch(err => reject(err))
    })
  },
  addProfileProjects ({dispatch}, profileProjects) {
    return Promise.all(profileProjects.map(pp => {
      dispatch('addProfileProject', pp)
    }))
  },
  addProfileProject ({ commit, state }, profileProject) {
    return new Promise((resolve, reject) => {
      commit(types.ADD_PROFILEPROJECT, profileProject)
      commit(types.ADD_PPTOPROFILE, profileProject)
      commit(types.ADD_PPTOPROJECT, profileProject)
      resolve()
    })
  },
  updateProfileProject ({ commit }, projectProfile) {
    return new Promise((resolve, reject) => {
      alterProjectProfile(projectProfile)
        .then(response => {
          const pp = response.data
          commit(types.UPDATE_PROFILEPROJECT, pp)

          commit(types.REMOVE_PPFROMPROFILE, pp)
          commit(types.ADD_PPTOPROFILE, pp)

          commit(types.REMOVE_PPFROMPROJECT, pp)
          commit(types.ADD_PPTOPROJECT, pp)

          resolve(pp)
        })
        .catch(err => reject(err))
    })
  },
  removeProfileProject ({ commit }, profileProject) {
    return new Promise((resolve, reject) => {
      deleteProjectProfile(profileProject)
        .then(response => {
          commit(types.REMOVE_PROFILEPROJECT, profileProject)
          commit(types.REMOVE_PPFROMPROJECT, profileProject)
          commit(types.REMOVE_PPFROMPROFILE, profileProject)
          resolve(response)
        })
        .catch(err => reject(err))
    })
  },
  fetchProfileProjects ({ commit, dispatch }, fetchFunction) {
    return new Promise((resolve, reject) => {
      commit(types.PROFILEPROJECTS_REQUEST)
      fetchFunction()
        .then(response => {
          dispatch('addProfileProjects', response.data).then(() => {
            commit(types.PROFILEPROJECTS_SUCCESS)
            resolve()
          })
        })
        .catch(err => {
          commit(types.PROFILEPROJECTS_ERROR, err)
          reject(err)
        })
    })
  },
  fetchPPsOfProject ({ commit, dispatch }, projectId) {
    const fetchFunction = getProfilesOfProject(projectId)
    dispatch('fetchProfileProjects', fetchFunction)
  },
  fetchPPsOfProfile ({ commit, dispatch }, profileId) {
    const fetchFunction = getProjectsOfProfile(profileId)
    dispatch('fetchProfileProjects', fetchFunction)
  },
  fetchAllFutureProfileProjects ({ commit, dispatch }) {
    const fetchFunction = getAllFutureProfileProjects
    dispatch('fetchProfileProjects', fetchFunction)
  }
}
