import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import SkillChart from '@/components/Dashboard/SkillChart'
import RadarChart from '@/components/Charts/RadarChart'
import BarChart from '@/components/Charts/BarChart'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

const mockSkillInfo = {
  1: {
    name: 'SkillOne',
    proficiencies: [3],
    willingness: [4],
    proficiencyAverage: 3,
    willingnessAverage: 4
  },
  2: {
    name: 'SkillTwo',
    proficiencies: [1, 5, 3],
    willingness: [0, 5, 1],
    proficiencyAverage: 3,
    willingnessAverage: 2
  },
  3: {
    name: 'SkillThree',
    proficiencies: [1, 2, 1, 2],
    willingness: [1, 1, 2, 2],
    proficiencyAverage: 1.5,
    willingnessAverage: 1
  },
  4: {
    name: 'SkillFour',
    proficiencies: [2, 4, 3],
    willingness: [2, 4, 3],
    proficiencyAverage: 3,
    willingnessAverage: 3
  }
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    actions: {
      updateProfile: jest.fn()
    },
    getters: {
      appInitialized: () => true,
      profileList: () => [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }]
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    propsData: {
      size: 12,
      skills: { 1: { id: 1, name: 'SkillOne' },
        2: { id: 2, name: 'SkillTwo' },
        3: { id: 3, name: 'SkillThree' },
        4: { id: 4, name: 'SkillFour' }
      },
      skillInfo: mockSkillInfo,
      profileList: [{ id: 1, name: 'Foo' }, { id: 2, name: 'Bar' }]
    },
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(SkillChart, mergedMountingOptions)
}
describe('SkillChart.vue', () => {
  it('Renders BarChart and RadarChart', () => {
    const wrapper = createWrapper()
    expect(wrapper.find(RadarChart).isVisible()).toBeTruthy()
    expect(wrapper.find(BarChart).isVisible()).toBeTruthy()
  })

  it('Should choose 3 most widely known skills as selected skills when mounted', () => {
    const expected = [
      { 'id': 2, 'label': 'SkillTwo' },
      { 'id': 3, 'label': 'SkillThree' },
      { 'id': 4, 'label': 'SkillFour' }
    ]
    const wrapper = createWrapper()
    expect(wrapper.vm.selectedSkills).toEqual(expected)
  })
})
