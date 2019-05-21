import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProjectForm } from '@/components/Project'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

import { createWrapper } from './setup/setup'

const defaultStoreConfig = {
  actions: {
    createProject: jest.fn(() => []),
    updateProject: jest.fn(() => [])
  }
}

const defaultMountingOptions = {
  mocks: {
    $toasted: {
      global: {
        rytmi_success: jest.fn()
      }
    }
  }
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
    const wrapper = createWrapper(ProjectForm,
      merge({}, defaultStoreConfig, { actions }),
      merge({}, defaultMountingOptions, { propsData }))
    wrapper.setData({
      showProjectForm: true
    })
    wrapper.find('button').trigger('submit')
    await flushPromises()
    const apiErrorDetailsWrapper = wrapper.find(ApiErrorDetailsPanel)
    expect(apiErrorDetailsWrapper.exists()).toBeTruthy()
  })

  it('Submits the form and calls create project when submit is clicked and project id is uknown', async () => {
    const expectedResult = {
      code: '1234',
      startDate: null,
      endDate: null,
      isSecret: false,
      descriptions: [
        { customerName: '', name: '', description: '', language: 'fi' },
        { customerName: '', name: '', description: '', language: 'en' }
      ]
    }

    const actions = {
      createProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const documentMock = jest.spyOn(document, 'getElementById')
    documentMock.mockImplementation(() => ({
      reset: jest.fn()
    }))
    const wrapper = createWrapper(ProjectForm, merge({}, defaultStoreConfig, { actions }), defaultMountingOptions)
    wrapper.setData({ showProjectForm: true })
    wrapper.findAll('input').at(0).setValue(1234)
    wrapper.find('button').trigger('submit')
    await flushPromises()
    expect(actions.createProject).toHaveBeenCalledWith(expect.anything(), expectedResult, undefined)
  })

  it('Submit the form and calls update project when submit is clicked and project id is known', async () => {
    const actions = {
      updateProject: jest.fn((obj, project, dno) => Promise.resolve(project))
    }
    const propsData = {
      editableProject: {
        id: 1,
        code: '1234',
        startDate: new Date('2018-01-01T00:00:00.000Z'),
        endDate: new Date('2018-02-01T00:00:00.000Z')
      }
    }
    const wrapper = createWrapper(ProjectForm,
      merge({}, defaultStoreConfig, { actions }),
      merge({}, defaultMountingOptions, { propsData }))
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
    const wrapper = createWrapper(ProjectForm, defaultStoreConfig, defaultMountingOptions)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
