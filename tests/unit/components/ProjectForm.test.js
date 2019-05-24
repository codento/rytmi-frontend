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

const mockEmployers = {
  1: {
    createdAt: '2019-05-21T13:21:48.222Z',
    id: 1,
    name: 'Codento Oy',
    updatedAt: '2019-05-21T13:21:48.222Z'
  },
  2: {
    createdAt: '2019-05-21T13:21:56.034Z',
    id: 2,
    name: 'Macejkovic Inc',
    updatedAt: '2019-05-21T13:21:56.034Z'
  }
}
const getters = {
  employers: () => mockEmployers
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      createProject: jest.fn(() => []),
      updateProject: jest.fn(() => [])
    },
    getters: {
      employers: jest.fn(() => {})
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

describe('ProjectForm.test.js', () => {
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
    const store = createStore({ actions, getters })
    const wrapper = createWrapper({ propsData, store })
    wrapper.setData({
      showProjectForm: true
    })
    wrapper.find('button').trigger('submit')
    await flushPromises()
    const apiErrorDetailsWrapper = wrapper.find(ApiErrorDetailsPanel)
    expect(apiErrorDetailsWrapper.exists()).toBeTruthy()
  })

  it('Submits the form and calls create project when submit is clicked and project id is unknown', async () => {
    const expectedResult = {
      code: '1234',
      startDate: null,
      endDate: null,
      isSecret: false,
      descriptions: [
        { customerName: '', name: '', description: '', language: 'fi' },
        { customerName: '', name: '', description: '', language: 'en' }
      ],
      employerId: 1,
      isInternal: false,
      id: null
    }
    const actions = {
      createProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const documentMock = jest.spyOn(document, 'getElementById')
    documentMock.mockImplementation(() => ({
      reset: jest.fn()
    }))
    const store = createStore({ actions, getters })
    const propsData = {
      editableProject: {
        employerId: 1
      }
    }
    const wrapper = createWrapper({ store, propsData })
    wrapper.setData({ showProjectForm: true })
    wrapper.findAll('input').at(1).setValue(1234)
    wrapper.find('button').trigger('submit')
    await flushPromises()
    expect(actions.createProject).toHaveBeenCalledWith(expect.anything(), expectedResult, undefined)
  })

  it('Submit the form and calls update project when submit is clicked and project id is known', async () => {
    const actions = {
      updateProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const store = createStore({ actions, getters })
    const propsData = {
      editableProject: {
        id: 1,
        code: '1234',
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        endDate: new Date('2018-02-01T00:00:00.000Z'),
        isSecret: false,
        descriptions: [
          { customerName: '', name: '', description: '', language: 'fi' },
          { customerName: '', name: '', description: '', language: 'en' }
        ],
        employerId: 1,
        isInternal: false
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
    const store = createStore({ getters })
    let wrapper = mount(ProjectForm, {
      store,
      localVue,
      propsData: {
        editableProject: {
          id: 1,
          code: '1234',
          startDate: new Date('2018-01-01T00:00:00.000Z'),
          endDate: new Date('2018-02-01T00:00:00.000Z'),
          isSecret: false,
          descriptions: [
            { customerName: '', name: '', description: '', language: 'fi' },
            { customerName: '', name: '', description: '', language: 'en' }
          ],
          employerId: 1,
          isInternal: false
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
