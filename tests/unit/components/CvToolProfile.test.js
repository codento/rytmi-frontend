import _ from 'lodash'
import { CvToolProfile } from '@/components/Profile'
import { getters } from '@/store/modules/cvTool/getters'
import { actions } from '@/store/modules/cvTool/actions'
import { mutations } from '@/store/modules/cvTool/mutations'
import { createShallowWrapper, createWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const initialState = {
  cvIntroduction: '',
  keySkills: [],
  recentProjects: []
}

const defaultStoreConfig = {
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
    const expectedIntroduction = mockProfile.introduction.fi
    const wrapper = createWrapper(CvToolProfile, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.props().profile).toEqual(mockProfile)
    expect(wrapper.vm.fullName).toBe('Foo Bar')
    expect(wrapper.vm.modifiedIntroduction).toBe(expectedIntroduction)
  })

  it('Shows key skills', () => {
    const overrideStore = {
      state: {
        keySkills: [
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
    const mergeStoreConfigs = _.merge({}, defaultStoreConfig, overrideStore)
    const mergedMountingOptions = _.merge({}, defaultMountingOptions, overrideMountingOptions)
    const wrapper = createShallowWrapper(CvToolProfile, mergeStoreConfigs, mergedMountingOptions)
    expect(wrapper.vm.orderedSkills.length).toEqual(1)
  })
})
