import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProjectProfileForm } from '../../../src/components/Project'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      profiles: jest.fn(() => []),
      projects: jest.fn(() => [])
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
  return mount(ProjectProfileForm, mergedMountingOptions)
}

describe('ProjectProfileForm.vue', () => {
  it('shows consultant select when consultant profile is unknown', () => {
    const propsData = {
      projectId: 1,
      profileId: null
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('#consultantLabel').isVisible()).toBe(true)
    expect(wrapper.find('#ProjectLabel').element.style.display).toBe('none')
  })

  it('shows project select when project is unknown', () => {
    const propsData = {
      projectId: null,
      profileId: 1
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('#ProjectLabel').isVisible()).toBe(true)
    expect(wrapper.find('#consultantLabel').element.style.display).toBe('none')
  })

  it('calls newProjectProfile when form is submitted', async () => {
    const propsData = {
      projectId: null,
      profileId: 1
    }

    const actions = {
      newProjectProfile: jest.fn(() => Promise.resolve())
    }
    const getElementById = jest.spyOn(document, 'getElementById')
    const reset = jest.fn()
    getElementById.mockImplementation(() => ({
      reset
    }))
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(actions.newProjectProfile).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('closes the form when toggleForm is present and form is submitted', async () => {
    const propsData = {
      projectId: null,
      profileId: 1,
      toggleForm: jest.fn()
    }
    const actions = {
      newProjectProfile: jest.fn(() => Promise.resolve())
    }
    const getElementById = jest.spyOn(document, 'getElementById')
    const reset = jest.fn()
    getElementById.mockImplementation(() => ({
      reset
    }))
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(propsData.toggleForm).toHaveBeenCalledTimes(1)
  })

  it('shows errors when form submit fails', async () => {
    const propsData = {
      projectId: null,
      profileId: 1
    }
    const apiError = {
      response: {
        data: {
          error: {
            details: ['Failure']
          }
        }
      }
    }
    const actions = {
      newProjectProfile: jest.fn(() => Promise.reject(apiError))
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(wrapper.vm.errorDetails[0]).toBe('Failure')
    expect(wrapper.find('div[class="profile-form-errors"]').isVisible()).toBe(true)
  })
})
