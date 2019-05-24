import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProfileForm } from '@/components/EditProfile'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const mockEmployeeRoles = [
  { id: 1, title: 'somethinger' },
  { id: 2, title: 'dunno lol' }
]

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      updateProfile: jest.fn(() => [])
    },
    getters: {
      employeeRoles: jest.fn(() => mockEmployeeRoles)
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    mocks: {
      $toasted: {
        global: {
          rytmi_success: jest.fn()
        }
      }
    },
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(ProfileForm, mergedMountingOptions)
}

const mockProfile = {
  id: 2,
  firstName: 'Foo',
  lastName: 'Bar',
  role: 'Employee role',
  birthYear: 1984,
  phone: 1234,
  cvDescriptions: [
    { description: 'kuvaus1', language: 'fi', type: 'introduction' },
    { description: 'desc1', language: 'en', type: 'introduction' },
    { description: 'markdown kuvaus', language: 'fi', type: 'other' },
    { description: 'markdown desc', language: 'en', type: 'other' }
  ],
  email: 'foo.bar@barfoo.com',
  employeeRoles: [1],
  links: ['http://christy.net', 'http://holly.biz', 'http://www.linkedin.com/username']
}

describe('ProfileForm.vue', () => {
  it('should should show profile details correctly', () => {
    const propsData = {
      profile: mockProfile
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.vm.editedProfile).toEqual(mockProfile)
    const inputWrappers = wrapper.findAll('input')
    expect(inputWrappers.at(0).vm.value).toBe(mockProfile.firstName)
    expect(inputWrappers.at(1).vm.value).toBe(mockProfile.lastName)
    expect(inputWrappers.at(3).vm.value).toBe(mockProfile.birthYear)
    expect(inputWrappers.at(4).vm.value).toBe(mockProfile.email)
    expect(inputWrappers.at(5).vm.value).toBe(mockProfile.phone)
    const textAreaWrappers = wrapper.findAll('textarea')
    expect(textAreaWrappers.at(0).vm.value).toBe(mockProfile.cvDescriptions[0].description)
    expect(textAreaWrappers.at(1).vm.value).toBe(mockProfile.cvDescriptions[1].description)
  })

  it('should submit entered details when submit is clicked', async () => {
    expect.assertions(3)
    const propsData = {
      profile: mockProfile
    }
    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const actions = {
      updateProfile: jest.fn((mapActionsStuff, profile, undef) => Promise.resolve(profile))
    }
    const editedProfile = Object.assign({}, mockProfile)
    editedProfile.firstName = 'Bar'
    const store = createStore({ actions })
    const wrapper = createWrapper({ store, propsData, mocks })
    wrapper.find('#firstNameInput').setValue('Bar')
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(), editedProfile, undefined)
    expect(wrapper.vm.showError).toBe(false)
    expect(wrapper.vm.errorDetails).toHaveLength(0)
  })

  it('should go back to profile view when reset is clicked', () => {
    expect.assertions(3)
    const propsData = {
      profile: mockProfile
    }
    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const wrapper = createWrapper({ propsData, mocks })
    wrapper.find('button[type="reset"]').trigger('reset')
    expect(mocks.$router.push).toHaveBeenCalledWith(`/profile/${mockProfile.id}`)
    expect(wrapper.vm.showError).toBe(false)
    expect(wrapper.vm.errorDetails).toHaveLength(0)
  })

  it('shows error when submit fails', async () => {
    expect.assertions(3)
    const propsData = {
      profile: mockProfile
    }
    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const apiError = {
      details: ['Nope not today']
    }
    const actions = {
      updateProfile: jest.fn((mapActionsStuff, profile, undef) => Promise.reject(apiError))
    }
    const editedProfile = Object.assign({}, mockProfile)
    editedProfile.firstName = 'Bar'
    const store = createStore({ actions })
    const wrapper = createWrapper({ store, propsData, mocks })
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(wrapper.vm.showError).toBe(true)
    expect(wrapper.find(ApiErrorDetailsPanel).isVisible()).toBeTruthy()
    expect(wrapper.vm.errorDetails).toHaveLength(1)
  })

  it('returns correct employeeRoleList', () => {
    const propsData = {
      profile: mockProfile
    }
    const wrapper = createWrapper({ propsData })
    wrapper.setData({ selectedEmployeeRoles: [] })
    expect(wrapper.vm.employeeRoleList).toEqual([{ 'id': 1, 'label': 'somethinger' }, { 'id': 2, 'label': 'dunno lol' }])
  })
})
