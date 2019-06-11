import { cloneDeep } from 'lodash'
import { ProjectList } from '@/components/Project'
import projectGetters from '@/store/modules/projects/getters'
import employerGetters from '@/store/modules/employers/getters'
import { createShallowWrapper } from './setup/setup'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

const mockProjects = {
  11: {
    id: 11,
    code: 100,
    employerId: 1,
    name: { fi: 'yksi', en: 'one' },
    description: { fi: 'testi', en: 'test' },
    customerName: { fi: 'asiakas', en: 'customer' },
    isInternal: false
  },
  12: {
    id: 12,
    code: 200,
    employerId: 1,
    name: { fi: 'kaksi', en: 'two' },
    description: { fi: 'testi', en: 'test' },
    customerName: { fi: '', en: '' },
    isInternal: true
  },
  13: {
    id: 13,
    code: 300,
    employerId: 1,
    name: { fi: 'kolme', en: 'three' },
    description: { fi: 'testi', en: 'test' },
    customerName: { fi: '', en: '' },
    isInternal: true
  },
  14: {
    id: 14,
    code: null,
    employerId: 2,
    name: { fi: 'neljä', en: 'four' },
    description: { fi: 'testi', en: 'test' }
  }
}

const mockEmployers = {
  1: {
    id: 1,
    name: INTERNAL_COMPANY_NAME
  },
  2: {
    id: 2,
    name: 'Some other company'
  }
}

const defaultStoreConfig = {
  getters: {
    ...projectGetters,
    ...employerGetters
  },
  state: {
    projects: mockProjects,
    employers: mockEmployers
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
    const overrideStoreConfig = cloneDeep(defaultStoreConfig)
    overrideStoreConfig.state.projects = {}
    const wrapper = createShallowWrapper(ProjectList, overrideStoreConfig, {})
    expect(wrapper.vm.results.length).toEqual(0)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('Shows all internal company projects when filter is empty', () => {
    const wrapper = createShallowWrapper(ProjectList, defaultStoreConfig, {})
    expect(wrapper.vm.internalCompanyId).toEqual(mockEmployers[1].id)
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
