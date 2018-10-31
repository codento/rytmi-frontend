import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import projectModule from '@/store/modules/projects'
import { cloneDeep } from 'lodash'
import { getProjects, newProject, deleteProject, alterProject } from '@/utils/api'
import flushPromises from 'flush-promises'

jest.mock('@/utils/api')
const mockProject = { id: 1, name: 'one' }

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Projects.actions', () => {
  it('should fetch the projects from the api', async () => {
    expect.assertions(1)
    const store = new Vuex.Store(cloneDeep(projectModule))
    getProjects.mockImplementation(() => Promise.resolve({ data: [mockProject] }))
    store.dispatch('fetchProjects')
    await flushPromises()
    expect(store.getters.projects).toEqual({ 1: mockProject })
  })

  it('should call the api with new project and add it to the list when called', async () => {
    expect.assertions(1)
    const store = new Vuex.Store(cloneDeep(projectModule))
    newProject.mockImplementation((project) => Promise.resolve({ data: project }))
    store.dispatch('createProject', mockProject)
    await flushPromises()
    expect(store.getters.projects).toEqual({ 1: mockProject })
  })

  it('should call the api with the id of the project to be removed and remove given project from state', async () => {
    expect.assertions(1)
    const storeConfig = cloneDeep(projectModule)
    storeConfig.state.projects[1] = mockProject
    deleteProject.mockImplementation((project) => Promise.resolve({ data: project }))
    const store = new Vuex.Store(storeConfig)
    store.dispatch('removeProject', mockProject)
    await flushPromises()
    expect(store.getters.projects).toEqual({})
  })

  it('should call the api with updated project info and alter the state with the response', async () => {
    expect.assertions(1)
    const storeConfig = cloneDeep(projectModule)
    storeConfig.state.projects[1] = mockProject
    const alteredProject = Object.assign({ name: 'newname' }, mockProject)
    alterProject.mockImplementation((project) => Promise.resolve({ data: project }))
    const store = new Vuex.Store(storeConfig)
    store.dispatch('updateProject', alteredProject)
    await flushPromises()
    expect(store.getters.projects).toEqual({ 1: alteredProject })
  })
})
