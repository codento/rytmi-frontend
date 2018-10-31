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

function createStore (overrideConfig) {
  const getters = {
    profileById: () => () => { id: 5 }
  }
  const actions = {

  }
  const mutations = {

  }
  const mergedStoreConfig = merge({ getters, actions, mutations }, overrideConfig)
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
  it('Should show correct components when profileId is not null', () => {
    const propsData = {
      profileId: '5'
    }
    const wrapper = createWrapper({ propsData })
    const profileFormWrapper = wrapper.find(ProfileForm)
    expect(profileFormWrapper.isVisible()).toBeTruthy()
  })
})
