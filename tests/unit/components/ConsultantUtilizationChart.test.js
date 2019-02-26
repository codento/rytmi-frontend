import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import LineChart from '@/components/Charts/LineChart'
import { merge } from 'lodash'
import ConsultantUtilizationChart from '@/components/Dashboard/ConsultantUtilizationChart'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
const firstOfNovember = new Date('2018-11-01')

const mockProfiles = {
  1: { id: '1' },
  2: { id: '2' },
  3: { id: '3' },
  4: { id: '4' },
  5: { id: '5' }
}
const mockProjectProfiles = [
  {
    projectId: 1,
    profileId: '1',
    startDate: new Date('2018-11-01'),
    endDate: new Date('2018-12-31')
  },
  {
    projectId: 1,
    profileId: '2',
    startDate: new Date('2018-11-01'),
    endDate: new Date('2018-11-30')
  },
  {
    projectId: 2,
    profileId: '2',
    startDate: new Date('2018-12-15'),
    endDate: new Date('2018-12-31')
  },
  {
    projectId: 2,
    profileId: '3',
    startDate: new Date('2018-12-01'),
    endDate: new Date('2018-12-31')
  },
  {
    projectId: 5,
    profileId: '3',
    startDate: new Date('2018-12-01'),
    endDate: null
  },
  {
    projectId: 2,
    profileId: '4',
    startDate: new Date('2018-12-01'),
    endDate: new Date('2018-12-31')
  },
  {
    projectId: 3,
    profileId: '5',
    startDate: new Date('2018-11-28'),
    endDate: new Date('2018-12-31')
  }
]
function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      profileFilter: () => () => mockProfiles,
      futureProjectsOfProfile: () => (id) => mockProjectProfiles.filter(pp => {
        return pp.profileId === id
      })
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
  return shallowMount(ConsultantUtilizationChart, mergedMountingOptions)
}

describe('ConsultantUtilizationChart.vue', () => {
  it('Should show line chart', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(LineChart).isVisible()).toBeTruthy()
  })

  it('Should show correct amount of consultants utilized', () => {
    const wrapper = createWrapper()
    const utilized = 2
    const notUtilized = 3
    wrapper.vm.today = firstOfNovember
    wrapper.vm.utilized = 0
    wrapper.vm.notUtilized = 0
    wrapper.vm.countUtilizedActiveProfiles()
    expect(wrapper.vm.utilized).toEqual(utilized)
    expect(wrapper.vm.notUtilized).toEqual(notUtilized)
  })

  it('Should calculate consultant utilization on frequency of one week', () => {
    const wrapper = createWrapper()
    const expectedLabels = [
      '1.11.2018',
      '8.11.2018',
      '15.11.2018',
      '22.11.2018',
      '29.11.2018',
      '6.12.2018',
      '13.12.2018',
      '20.12.2018',
      '27.12.2018',
      '3.1.2019'
    ]
    const expectedUtilization = [2, 2, 2, 2, 3, 4, 4, 5, 5, 1]
    const result = wrapper.vm.mapUtilizationOnTimeFrame(firstOfNovember, new Date('2019-01-07'))
    expect(result.data.length).toBe(result.labels.length)
    expect(result.data).toEqual(expectedUtilization)
    expect(result.labels).toEqual(expectedLabels)
  })
})
