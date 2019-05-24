import { ProjectList } from '@/components/Project'
import getters from '@/store/modules/projects/getters'
import { createShallowWrapper } from './setup/setup'

const mockProjects = {
  11: {
    id: 11,
    code: 100,
    descriptions: [
      { name: 'one', description: 'test', language: 'en' },
      { name: 'yksi', description: 'testi', language: 'fi' }
    ]
  },
  12: {
    id: 12,
    code: 200,
    descriptions: [
      { name: 'two', language: 'en' },
      { name: 'kaksi', language: 'fi' }
    ]
  },
  13: {
    id: 13,
    code: 300,
    descriptions: [
      { name: 'three', language: 'en' },
      { name: 'kolme', language: 'fi' }
    ]
  }
}

const defaultStoreConfig = {
  getters: getters,
  state: {
    projects: mockProjects
  }
}

describe('ProjectList.vue', () => {
  it('Calls openProject when btable emits row-clicked', () => {
    const mocks = {
      $router: {
        push: jest.fn()
      }
    }
    const wrapper = createShallowWrapper(ProjectList, defaultStoreConfig, { mocks })
    const table = wrapper.find({ name: 'BTable' })
    table.vm.$emit('row-clicked', { id: 1 })
    expect(table.emitted).toHaveLength(1)
    expect(mocks.$router.push).toHaveBeenCalled()
  })

  it('Template is correct', () => {
    const overrideStoreConfig = {
      getters: getters,
      state: { projects: {} }
    }
    const wrapper = createShallowWrapper(ProjectList, overrideStoreConfig, {})
    expect(wrapper.element).toMatchSnapshot()
  })

  it('Shows all projects when filter is empty', () => {
    const wrapper = createShallowWrapper(ProjectList, defaultStoreConfig, {})
    expect(wrapper.vm.results.length).toEqual(3)
  })

  it('Filtering projects should work', () => {
    const wrapper = createShallowWrapper(ProjectList, defaultStoreConfig, {})
    wrapper.setData({ projectFilterTerm: 'yksi' })
    expect(wrapper.vm.results.length).toEqual(1)
    wrapper.setData({ projectFilterTerm: '00' })
    expect(wrapper.vm.results.length).toEqual(3)
    wrapper.setData({ projectFilterTerm: '30' })
    expect(wrapper.vm.results.length).toEqual(1)
    wrapper.setData({ projectFilterTerm: 'thr' })
    expect(wrapper.vm.results.length).toEqual(1)
  })
})
