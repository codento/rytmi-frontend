import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import _ from 'lodash'

import { CvToolWorkExperience } from '@/components/Profile'
import { ProjectRow } from '@/components/Common'
import { state, getters, actions, mutations } from '@/store/modules/cvTool/index'
import { createStore } from './setup/createTestStore'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createWrapper (overrideMountingOptions, overrideStoreConfigs) {
  const cvToolStore = {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
  }
  const defaultMountingOptions = {
    localVue,
    store: createStore(_.merge(overrideStoreConfigs, cvToolStore)),
    propsData: {
      profileProjects: [
        { id: 1, projectId: 10, endDate: '2019-12-04T21:51:49.963Z' },
        { id: 2, projectId: 20, endDate: '2019-12-01T21:51:49.963Z' },
        { id: 3, projectId: 30, endDate: '2019-12-02T22:50:41.000Z' },
        { id: 4, projectId: 40, endDate: '2019-12-02T22:50:41.001Z' }
      ]
    }
  }
  const mergedMountingOptions = _.merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvToolWorkExperience, mergedMountingOptions)
}

describe('CvToolWorkExperience.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll(ProjectRow).length).toBe(4)
    expect(wrapper.findAll('input').length).toBe(4)
  })

  it('Should disable selection when maximum skills are selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ maxSelected: 2 })
    wrapper.setData({ selectedProjects: [1, 2] })
    expect(wrapper.vm.isNotSelectable(3)).toBeTruthy()
  })

  it('Should select by default latest 3 (maxSelexted=3) projects', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.selectedProjects).toEqual([10, 40, 30])
  })
})
