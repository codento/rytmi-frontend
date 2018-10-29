import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import projectModule from '../../../../../src/store/modules/projects'
import { cloneDeep } from 'lodash'
import * as types from '../../../../../src/store/mutation-types'

jest.mock('../../../../../src/utils/api')
const localVue = createLocalVue()
localVue.use(Vuex)

describe('Projects.mutations', () => {
  it('should add profile to project profile list when the profile is not added to the project already', () => {
    const store = new Vuex.Store(cloneDeep(projectModule))
    store.commit(types.ADD_PPTOPROJECT, { id: 10, projectId: 5 })
    expect(store.state.profileProjectList[5]).toHaveLength(1)
  })

  it('should remove profile from project profile list', () => {
    const storeConfig = cloneDeep(projectModule)
    storeConfig.state.profileProjectList[2] = [5]
    const store = new Vuex.Store(storeConfig)
    store.commit(types.REMOVE_PPFROMPROJECT, { id: 5, projectId: 2 })
    expect(store.state.profileProjectList).toEqual({ 2: [] })
  })
})
