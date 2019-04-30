import { addMonths, subMonths } from 'date-fns'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { UtilizationChart } from '@/components/Profile'
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
    startDate: subMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 1),
    workPercentage: 100
  },
  {
    projectId: 1,
    profileId: '6',
    startDate: subMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 1),
    workPercentage: 100
  },
  {
    projectId: 2,
    profileId: '3',
    startDate: subMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 8),
    workPercentage: 20
  },
  {
    projectId: 3,
    profileId: '3',
    startDate: addMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 10),
    workPercentage: 80
  },
  {
    projectId: 2,
    profileId: '7',
    startDate: subMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 8),
    workPercentage: 20
  },
  {
    projectId: 3,
    profileId: '7',
    startDate: addMonths(Date.now(), 1),
    endDate: addMonths(Date.now(), 10),
    workPercentage: 80
  },
  {
    projectId: 4,
    profileId: '4',
    startDate: subMonths(Date.now(), 1),
    endDate: null,
    workPercentage: 100
  }
]
function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      profileFilter: () => () => mockProfiles,
      futureProjectsOfProfile: () => (id) => mockProjectProfiles.filter(profileProject => {
        return profileProject.profileId === id
      }),
      profileProjectsByProfileId: profileProjectGetters.profileProjectsByProfileId
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
  it('Should render components', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(UtilizationChart).isVisible()).toBeTruthy()
  })

  it('Should filter out profiles if the role they have is only administrative', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.orderedProfiles.length).toEqual(7)
    expect(wrapper.vm.orderedProfiles.filter(item => item.profile.id === 8)).toEqual([])
  })

  it('Should list free or soon to be free consultants in initiallyVisibleProfiles, ordered by utilization', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.initiallyVisibleProfiles.length).toEqual(4)
    expect(wrapper.vm.initiallyVisibleProfiles[0].daysToZeroUtilization).toEqual(0)
    expect(wrapper.vm.initiallyVisibleProfiles[3].daysToZeroUtilization).toEqual(30)
  })
  it('Should list utilized consultants in initiallyHiddenProfiles, ordered by utilization', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.initiallyHiddenProfiles.length).toEqual(3)
    expect(wrapper.vm.initiallyHiddenProfiles[0].daysToZeroUtilization).toEqual(304)
  })
  it('Should show correct amount of data in sections', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.sectionsData[1].length).toEqual(2)
    expect(wrapper.vm.sectionsData[2].length).toEqual(2)
    expect(wrapper.vm.sectionsData[3].length).toEqual(2)
    expect(wrapper.vm.sectionsData[4].length).toEqual(1)
  })
})
