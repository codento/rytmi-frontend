import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import EditProfile from '@/views/EditProfile'
import {
  EditLinks,
  EditSkills,
  EditProjects,
  ProfileForm
} from '@/components/EditProfile'
import { merge } from 'lodash'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const mockProfile = { id: 5 }

function createStore (overrideConfig) {
  const getters = {
    profileById: () => () => mockProfile
  }
  const mergedStoreConfig = merge({ getters }, overrideConfig)
  return new Vuex.Store(mergedStoreConfig)
}

function createWrapper (overrideOptions) {
  const mountOptions = {
    localVue,
    store: createStore()
  }
  const mergedOptions = merge(mountOptions, overrideOptions)
  return shallowMount(EditProfile, mergedOptions)
}

describe('EditProfile.vue', () => {
  it('should not display any subcomponents when profile cannot be found', () => {
    const propsData = {
      profileId: 'unknownprofile'
    }
    const store = createStore({
      getters: {
        profileById: () => () => null
      }
    })
    const wrapper = createWrapper({ propsData, store })
    expect(wrapper.find(ProfileForm).exists()).toBeFalsy()
    expect(wrapper.find(EditLinks).exists()).toBeFalsy()
    expect(wrapper.find(EditSkills).exists()).toBeFalsy()
    expect(wrapper.find(EditProjects).exists()).toBeFalsy()
  })

  it('Should show correct components when profileId is not null', () => {
    const propsData = {
      profileId: '5'
    }
    const wrapper = createWrapper({ propsData })
    const profileFormWrapper = wrapper.find(ProfileForm)
    const editSkillsWrapper = wrapper.find(EditSkills)
    const editLinksWrapper = wrapper.find(EditLinks)
    const EditProjectsWrapper = wrapper.find(EditProjects)
    expect(profileFormWrapper.isVisible()).toBeTruthy()
    expect(profileFormWrapper.props().profile).toBe(mockProfile)
    expect(editSkillsWrapper.isVisible()).toBeTruthy()
    expect(editSkillsWrapper.props().profileId).toBe(mockProfile.id)
    expect(editLinksWrapper.isVisible()).toBeTruthy()
    expect(editLinksWrapper.props().profile).toBe(mockProfile)
    expect(EditProjectsWrapper.isVisible()).toBeTruthy()
    expect(EditProjectsWrapper.props().profileId).toBe(mockProfile.id)
    expect(wrapper.element).toMatchSnapshot()
  })
})
