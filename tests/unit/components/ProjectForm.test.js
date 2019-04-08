import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProjectForm } from '@/components/Project'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      createProject: jest.fn(() => []),
      updateProject: jest.fn(() => [])
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
  return mount(ProjectForm, mergedMountingOptions)
}

const mockProject = {
  id: 1,
  descriptions: [
    {
      description: 'Mock description',
      language: 'en',
      name: 'Mock project'
    },
    {
      description: 'Projektin kuvaus',
      language: 'fi',
      name: 'Projektin nimi'
    }
  ],
  startDate: '2018-10-01',
  endDate: '2018-10-11'
}

describe('ProjectForm.test.js', () => {
  it('Shows Add project when project id is unknown', () => {
    const propsData = { editableProject: null }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('h3').text()).toContain('Add a new project')
  })

  it('Shows Edit project when project id is known', () => {
    const propsData = { editableProject: mockProject }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find('h3').text()).toContain('Edit project')
  })

  it('Shows the form when heading is clicked', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('form').isVisible()).toBeFalsy()
    wrapper.find('h3').find('span').trigger('click')
    expect(wrapper.find('form').isVisible()).toBeTruthy()
  })

  it('Shows error message when update project fails', async () => {
    const apiError = {
      response: {
        data: {
          error: {
            details: ['Failure']
          }
        }
      }
    }
    const propsData = {
      editableProject: {
        id: 1,
        code: '1234',
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        endDate: new Date('2018-02-01T00:00:00.000Z')
      }
    }
    const actions = {
      updateProject: jest.fn(() => Promise.reject(apiError))
    }
    const store = createStore({ actions })
    const wrapper = createWrapper({ propsData, store })
    wrapper.setData({
      showProjectForm: true
    })
    wrapper.find('button').trigger('submit')
    await flushPromises()
    const apiErrorDetailsWrapper = wrapper.find(ApiErrorDetailsPanel)
    expect(apiErrorDetailsWrapper.exists()).toBeTruthy()
  })

  it('Submits the form and calls create project when submit is clicked and project id is uknown', async () => {
    const actions = {
      createProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const documentMock = jest.spyOn(document, 'getElementById')
    documentMock.mockImplementation(() => ({
      reset: jest.fn()
    }))
    const store = createStore({ actions })
    const wrapper = createWrapper({ store })
    wrapper.setData({ showProjectForm: true })
    wrapper.findAll('input').at(0).setValue(1234)
    wrapper.find('button').trigger('submit')
    await flushPromises()
    expect(actions.createProject).toHaveBeenCalledWith(expect.anything(), { code: '1234' }, undefined)
  })

  it('Submit the form and calls update project when submit is clicked and project id is known', async () => {
    const actions = {
      updateProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const store = createStore({ actions })
    const propsData = {
      editableProject: {
        id: 1,
        code: '1234',
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        endDate: new Date('2018-02-01T00:00:00.000Z')
      }
    }
    const wrapper = createWrapper({ store, propsData })
    wrapper.setData({ showProjectForm: true })
    wrapper.findAll('input').at(0).setValue(1234)
    wrapper.find('button').trigger('submit')
    await flushPromises()
    expect(actions.updateProject).toHaveBeenCalledWith(
      expect.anything(),
      propsData.editableProject,
      undefined)
  })

  it('Template is correct', () => {
    let wrapper = mount(ProjectForm, {})
    expect(wrapper.html()).toMatchSnapshot()
  })
})
