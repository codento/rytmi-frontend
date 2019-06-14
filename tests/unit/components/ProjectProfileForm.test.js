import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProjectProfileForm } from '@/components/Common'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

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
      profileProject: {
        projectId: 1,
        profileId: null
      }
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('#consultantSelectFormGroup').isVisible()).toBe(true)
    expect(wrapper.find('#projectSelectFormGroup').element.style.display).toBe('none')
  })

  it('shows project select when project is unknown', () => {
    const propsData = {
      profileProject: {
        projectId: null,
        profileId: 1
      }
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('#projectSelectFormGroup').isVisible()).toBe(true)
    expect(wrapper.find('#consultantSelectFormGroup').element.style.display).toBe('none')
  })

  it('calls newProjectProfile when form is submitted', async () => {
    expect.assertions(3)
    const propsData = {
      profileProject: {
        projectId: null,
        profileId: 1
      }
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
    wrapper.setData({ editableProfileProject:
        {
          ...propsData.profileproject,
          role: { fi: 'a', en: 'b' },
          projectId: 1,
          startDate: new Date('2018-01-01T00:00:00.000Z'),
          workPercentage: 100
        }
    })
    wrapper.setData({ validated: true })
    expect(wrapper.vm.formIsValid).toBeTruthy()
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(actions.newProjectProfile).toHaveBeenCalledTimes(1)
    expect(reset).toHaveBeenCalledTimes(1)
  })

  it('closes the form when toggleForm is present and form is submitted', async () => {
    const propsData = {
      profileProject: {
        projectId: null,
        profileId: 1
      },
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
    wrapper.setData({ editableProfileProject:
      {
        ...propsData.profileproject,
        role: { fi: 'a', en: 'b' },
        projectId: 1,
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        workPercentage: 100
      }
    })
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(propsData.toggleForm).toHaveBeenCalledTimes(1)
  })

  it('shows errors when form submit fails', async () => {
    expect.assertions(3)
    const propsData = {
      profileProject: {
        id: 1,
        projectId: 1,
        profileId: 1,
        role: { fi: 'a', en: 'b' },
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        workPercentage: 100
      }
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
      updateProfileProject: jest.fn(() => Promise.reject(apiError))
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.setData({ validated: true })
    wrapper.find('#project-profile-form').trigger('submit')
    await flushPromises()
    expect(wrapper.vm.errorDetails[0]).toBe('Failure')
    expect(wrapper.vm.showError).toBe(true)
    expect(wrapper.find(ApiErrorDetailsPanel).isVisible()).toBeTruthy()
  })
})
