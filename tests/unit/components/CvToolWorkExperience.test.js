import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import _ from 'lodash'

import { CvToolWorkExperience } from '@/components/Profile'
import { ProjectRow } from '@/components/Common'

import { createStore } from './setup/createTestStore'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createWrapper (overrideMountingOptions, overrideStoreConfigs) {
  const defaultMountingOptions = {
    localVue,
    store: createStore(_.extend(overrideStoreConfigs)),
    propsData: {
      profileProjects: [
        { id: 1, projectId: 10 },
        { id: 2, projectId: 20 },
        { id: 3, projectId: 30 }
      ]
    }
  }
  const mergedMountingOptions = _.extend(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvToolWorkExperience, mergedMountingOptions)
}

describe('CvToolWorkExperience.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll(ProjectRow).length).toBe(3)
    expect(wrapper.findAll('input').length).toBe(3)
  })

  it('Should disable selection when maximum skills are selected', () => {
    const wrapper = createWrapper()
    wrapper.setData({ maxSelected: 2 })
    wrapper.setData({ selectedProjects: [1, 2] })
    expect(wrapper.vm.isNotSelectable(3)).toBeTruthy()
  })
})
