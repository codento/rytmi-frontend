import { CvToolProfile } from '@/components/Profile'
import { state, getters, actions, mutations } from '@/store/modules/cvTool/index'
import { createWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const storeConfig = {
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
}

const additionalMountingOptions = {
  propsData: {
    profile: mockProfile
  }
}

describe('CvTool.test.js', () => {
  it('Renders correctly', () => {
    const wrapper = createWrapper(CvToolProfile, storeConfig, additionalMountingOptions)
    expect(wrapper.props().profile).toEqual(mockProfile)
    expect(wrapper.vm.fullName).toBe('Foo Bar')
    expect(wrapper.vm.modifiedIntroduction).toBe(mockProfile.cvDescriptions[0].description)
  })

  it('Birthday is converted to correct year', () => {
    const wrapper = createWrapper(CvToolProfile, storeConfig, additionalMountingOptions)
    expect(wrapper.vm.birthYear).toEqual('1984')
  })
})
