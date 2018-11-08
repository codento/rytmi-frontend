import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import { EditLinks } from '@/components/EditProfile'
import flushPromises from 'flush-promises'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      updateProfile: jest.fn()
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(EditLinks, mergedMountingOptions)
}

const mockProfile = {
  id: 1,
  links: ['http://test.fi']
}

describe('EditLinks.vue', () => {
  it('should show given links in profile', () => {
    const propsData = {
      profile: mockProfile
    }
    const wrapper = createWrapper({ propsData })
    const liWrappers = wrapper.find('ul').findAll('li')
    expect(liWrappers).toHaveLength(1)
    expect(liWrappers.at(0).text()).toContain(mockProfile.links[0])
  })

  it('should not call updateProfile when inserted link is already in the lists', async () => {
    expect.assertions(3)
    const propsData = {
      profile: mockProfile
    }
    const actions = {
      updateProfile: jest.fn()
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('input').setValue(mockProfile.links[0])
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(actions.updateProfile).not.toHaveBeenCalled()
    const apiErrorPanelWrapper = wrapper.find(ApiErrorDetailsPanel)
    expect(apiErrorPanelWrapper.isVisible()).toBeTruthy()
    expect(apiErrorPanelWrapper.text()).toBe('Url already exists')
  })

  it('should call updateProfile when inserted link is new', async () => {
    expect.assertions(2)
    const propsData = {
      profile: mockProfile
    }
    const actions = {
      updateProfile: jest.fn((obj, profile, dno) => Promise.resolve(profile))
    }
    const mockLink = 'http://test.net'
    const createdProfile = { ...mockProfile, links: mockProfile.links.slice() }
    createdProfile.links.push(mockLink)
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('input').setValue(mockLink)
    wrapper.find('button[type="submit"]').trigger('submit')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(),
      createdProfile,
      undefined
    )
    expect(wrapper.vm.linkInput).toBe('')
  })

  it('should call updateProfile when remove link is clicked', async () => {
    expect.assertions(1)
    const propsData = {
      profile: mockProfile
    }
    const actions = {
      updateProfile: jest.fn((obj, profile, dno) => Promise.resolve(profile))
    }
    const createdProfile = { ...mockProfile, links: [] }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('li').find('span').trigger('click')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(),
      createdProfile,
      undefined
    )
  })

  it('should show error when api call fails', async () => {
    expect.assertions(2)
    const propsData = {
      profile: mockProfile
    }
    const apiError = {
      details: ['Problems']
    }
    const actions = {
      updateProfile: jest.fn((obj, profile, dno) => Promise.reject(apiError))
    }
    const createdProfile = { ...mockProfile, links: [] }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('li').find('span').trigger('click')
    await flushPromises()
    expect(actions.updateProfile).toHaveBeenCalledWith(
      expect.anything(),
      createdProfile,
      undefined
    )
    expect(wrapper.vm.errorDetails).toBe(apiError.details)
  })
})
