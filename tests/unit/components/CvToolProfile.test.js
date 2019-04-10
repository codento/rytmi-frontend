import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import _ from 'lodash'
import { format } from 'date-fns'
import {
  CvToolProfile
} from '@/components/Profile'

import { createStore } from './setup/createTestStore'
import { mockProfile } from './setup/mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

function createWrapper (overrideMountingOptions, overrideStoreConfigs) {
  const defaultMountingOptions = {
    localVue,
    store: createStore(overrideStoreConfigs),
    propsData: {
      profile: mockProfile,
      relevantSkills: [],
      relevantProjects: []
    }
  }
  const mergedMountingOptions = _.extend(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvToolProfile, mergedMountingOptions)
}

describe('CvTool.test.js', () => {
  it('Renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.props().profile).toEqual(mockProfile)
    expect(wrapper.vm.getNames).toBe('Foo Bar')
    expect(wrapper.vm.profileDescription).toBe(mockProfile.cvDescriptions[0].description)
  })

  it('Birthday is converted to correct year', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.birthYear).toEqual('1984')
  })
})
