import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import Sortable from 'sortablejs'
import _ from 'lodash'
import { format } from 'date-fns'
import {
  CvTool,
  CvToolProfile,
  CvToolSkills,
  CvToolWorkExperience,
  CvToolOtherInfo
} from '@/components/Profile'
import { state, getters, actions, mutations } from '@/store/modules/cvTool/index'

import { createStore } from './setup/createTestStore'
import { mockProfile, mockGetters } from './setup/mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.directive('sortable', {
  inserted: function (el, binding) {
    return new Sortable(el, binding.value || {})
  }
})
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

function createWrapper (overrideMountingOptions, overrideStoreConfigs) {
  const cvToolStore = {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations
  }
  const defaultMountingOptions = {
    localVue,
    store: createStore(_.merge(mockGetters, cvToolStore, overrideStoreConfigs)),
    propsData: {
      profile: mockProfile
    }
  }

  const mergedMountingOptions = _.merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvTool, mergedMountingOptions)
}

describe('CvTool.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createWrapper()
    const profileWrapper = wrapper.find(CvToolProfile)
    const SkillsWrapper = wrapper.find(CvToolSkills)
    const ProjectsWrapper = wrapper.find(CvToolWorkExperience)
    const OtherInfoWrapper = wrapper.find(CvToolOtherInfo)
    expect(profileWrapper.isVisible()).toBeTruthy()
    expect(profileWrapper.props().profile).toEqual(mockProfile)
    expect(SkillsWrapper.isVisible()).toBeTruthy()
    expect(ProjectsWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.props().profile).toEqual(mockProfile)
  })

  it('Should disable button if inputs are not valid', () => {
    const wrapper = createWrapper()
    const button = wrapper.find('#create-cv-button')
    expect(button.find('disabled')).toBeTruthy()
  })
})
