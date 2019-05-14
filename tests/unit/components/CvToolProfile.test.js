import _ from 'lodash'
import { CvToolProfile } from '@/components/Profile'
import { getters } from '@/store/modules/cvTool/getters'
import { actions } from '@/store/modules/cvTool/actions'
import { mutations } from '@/store/modules/cvTool/mutations'
import { createShallowWrapper, createWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const initialState = {
  cvIntroduction: '',
  cvOtherInfo: '',
  topSkills: [],
  topProjects: []
}

const storeConfig = {
  state: initialState,
  getters: getters,
  actions: actions,
  mutations: mutations
}

const defaultMountingOptions = {
  propsData: {
    profile: mockProfile,
    profileSkills: []
  }
}

describe('CvToolProfile.test.js', () => {
  it('Renders correctly', () => {
    const wrapper = createWrapper(CvToolProfile, storeConfig, defaultMountingOptions)
    expect(wrapper.props().profile).toEqual(mockProfile)
    expect(wrapper.vm.fullName).toBe('Foo Bar')
    expect(wrapper.vm.modifiedIntroduction).toBe(mockProfile.cvDescriptions[0].description)
  })

  it('Shows top skills', () => {
    const overrideStore = {
      state: {
        topSkills: [
          {
            skillId: 1,
            name: 'Python',
            description: 'Python desc'
          }
        ]
      }
    }
    const overrideMountingOptions = {
      propsData: {
        profileSkills: [
          { skillId: 1 },
          { skillId: 2 },
          { skillId: 3 }
        ]
      }
    }
    const mergeStoreConfigs = _.merge(storeConfig, overrideStore)
    const mergedMountingOptions = _.merge(defaultMountingOptions, overrideMountingOptions)
    const wrapper = createShallowWrapper(CvToolProfile, mergeStoreConfigs, mergedMountingOptions)
    expect(wrapper.vm.orderedSkills.length).toEqual(1)
  })
})
