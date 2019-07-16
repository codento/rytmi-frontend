import { addDays, subDays } from 'date-fns'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { filter, merge } from 'lodash'
import ConsultantUtilizationList from '@/components/Dashboard/ConsultantUtilizationList'
import profileProjectGetters from '@/store/modules/profileProjects/getters'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

const mockProfiles = {
  1: { id: '1', employeeRoles: [1] }, // role1, utilization 0%
  2: { id: '2', employeeRoles: [1] }, // role1, utilization 100%, project ends in less than 3 months
  3: { id: '3', employeeRoles: [1, 2] }, // role1, utilization 100%, project ends in the future
  4: { id: '4', employeeRoles: [1] }, // role1, utilization 100%, undefined project end date
  5: { id: '5', employeeRoles: [2] }, // role2, utilization 0%
  6: { id: '6', employeeRoles: [2] }, // role2, utilization 100%, project ends in less than 3 months
  7: { id: '7', employeeRoles: [2] }, // role2, utilization 100%, project ends in the future
  8: { id: '8', employeeRoles: [3] } // role should be emitted from the list
}
const mockProjectProfiles = [
  {
    projectId: 1,
    profileId: '2',
    startDate: subDays(Date.now(), 30),
    endDate: addDays(Date.now(), 30),
    workPercentage: 100
  },
  {
    projectId: 1,
    profileId: '6',
    startDate: subDays(Date.now(), 30),
    endDate: addDays(Date.now(), 30),
    workPercentage: 100
  },
  {
    projectId: 2,
    profileId: '3',
    startDate: subDays(Date.now(), 30),
    endDate: addDays(Date.now(), 235),
    workPercentage: 20
  },
  {
    projectId: 3,
    profileId: '3',
    startDate: addDays(Date.now(), 30),
    endDate: addDays(Date.now(), 200),
    workPercentage: 80
  },
  {
    projectId: 2,
    profileId: '7',
    startDate: subDays(Date.now(), 30),
    endDate: addDays(Date.now(), 260),
    workPercentage: 20
  },
  {
    projectId: 3,
    profileId: '7',
    startDate: addDays(Date.now(), 30),
    endDate: addDays(Date.now(), 200),
    workPercentage: 80
  },
  {
    projectId: 4,
    profileId: '4',
    startDate: subDays(Date.now(), 30),
    endDate: null,
    workPercentage: 100
  }
]
const mockProjects = {
  1: {
    id: 1,
    name: { en: 'Project Foo', fi: 'Projekti Foo' },
    description: { en: 'Foo Bar', fi: 'Foo Bar' },
    customerName: { en: 'Customer', fi: 'Asiakas' },
    code: 50,
    startDate: new Date('2018-01-01'),
    endDate: new Date('2018-05-01'),
    isInternal: false
  },
  2: {
    id: 2,
    name: { en: 'Project Foo', fi: 'Projekti Foo' },
    description: { en: 'Foo Bar', fi: 'Foo Bar' },
    customerName: { en: 'Customer', fi: 'Asiakas' },
    code: 50,
    startDate: new Date('2018-01-01'),
    endDate: new Date('2018-05-01'),
    isInternal: false
  },
  3: {
    id: 3,
    name: { en: 'Project Foo', fi: 'Projekti Foo' },
    description: { en: 'Foo Bar', fi: 'Foo Bar' },
    customerName: { en: 'Customer', fi: 'Asiakas' },
    code: 50,
    startDate: new Date('2018-01-01'),
    endDate: new Date('2018-05-01'),
    isInternal: false
  },
  4: {
    id: 4,
    name: { en: 'Project Foo', fi: 'Projekti Foo' },
    description: { en: 'Foo Bar', fi: 'Foo Bar' },
    customerName: { en: 'Customer', fi: 'Asiakas' },
    code: 50,
    startDate: new Date('2018-01-01'),
    endDate: new Date('2018-05-01'),
    isInternal: false
  }
}
const employersMock = {
  1: { id: 1, name: 'Codento Oy' },
  2: { id: 2, name: 'Företag Ab' }
}
function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      profileFilter: () => () => mockProfiles,
      futureProjectsOfProfile: () => (id) => mockProjectProfiles.filter(profileProject => {
        return profileProject.profileId === id
      }),
      profileProjectsByProfileId: profileProjectGetters.profileProjectsByProfileId,
      projectById: () => (projectId) => filter(mockProjects, project => project.id === projectId),
      employerByName: () => (employerName) => filter(employersMock, employer => employer.name === employerName)
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
  return shallowMount(ConsultantUtilizationList, mergedMountingOptions)
}

describe('ConsultantUtilizationList.vue', () => {
  it('Should filter out profiles if the role they have is only administrative', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.orderedProfiles.length).toEqual(7)
    expect(wrapper.vm.orderedProfiles.filter(item => item.profile.id === 8)).toEqual([])
  })

  it('Should list free consultants in freeEmployees', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.freeEmployees.length).toEqual(2)
    expect(wrapper.vm.freeEmployees[0].daysToZeroUtilization).toEqual(0)
  })

  it('Should list soon to be free consultants in soonToBeFreeEmployees', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.soonToBeFreeEmployees.length).toEqual(2)
    expect(wrapper.vm.soonToBeFreeEmployees[0].daysToZeroUtilization).toEqual(30)
  })
})
