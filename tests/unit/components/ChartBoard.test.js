import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import ChartBoard from '@/components/Dashboard/ChartBoard'
import LoadingSpinner from '@/components/helpers/LoadingSpinner'
import SkillChart from '@/components/Dashboard/SkillChart'
import TopSkillChart from '@/components/Dashboard/TopSkillChart'
import MostWillingnessChart from '@/components/Dashboard/MostWillingnessChart'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

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
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(ChartBoard, mergedMountingOptions)
}

const mockSkills = {
  1: { id: 1, name: 'SkillOne' },
  2: { id: 2, name: 'SkillTwo' }
}

const mockSkillProfiles = [{ skillId: 1, knows: 3, wantsTo: 4 },
  { skillId: 2, knows: 1, wantsTo: 0 },
  { skillId: 2, knows: 5, wantsTo: 5 }]

describe('ChartBoard.vue', () => {
  it('should show loading spinner when app is loading', () => {
    const getters = {
      appInitialized: () => false
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.find(LoadingSpinner)).toBeTruthy()
  })

  it('should not show any charts when skills array is empty and loading has been done', () => {
    const getters = {
      skills: () => ({}),
      skillProfiles: () => mockSkillProfiles
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('#no-data-message').isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).exists()).toBeFalsy()
  })

  it('should not show any charts when skillProfiles array is empty and loading has been done', () => {
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => []
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.find('#no-data-message').isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).exists()).toBeFalsy()
  })

  it('should show SkillChart, TopSkillChart, MostWillingnessChart', () => {
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.find(TopSkillChart).isVisible()).toBeTruthy()
    expect(wrapper.find(MostWillingnessChart).isVisible()).toBeTruthy()
    expect(wrapper.find(SkillChart).isVisible()).toBeTruthy()
  })

  it('createEmptySkillObject should create object with skill id\'s as properties', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [],
        willingness: []
      },
      2: {
        name: 'SkillTwo',
        proficiencies: [],
        willingness: []
      }
    }
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.vm.createEmptySkillObject(wrapper.vm.skillList)).toEqual(expected)
  })

  it('groupSkillProfileBySkill should group profiles by skill', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [3],
        willingness: [4]
      },
      2: {
        name: 'SkillTwo',
        proficiencies: [1, 5],
        willingness: [0, 5]
      }
    }
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.vm.groupSkillProfilesBySkill(wrapper.vm.skillList)).toEqual(expected)
  })

  it('skillInfo should have skills by id with profiencies & willingess & averages of those two', () => {
    const expected = {
      1: {
        name: 'SkillOne',
        proficiencies: [3],
        willingness: [4],
        proficiencyAverage: 3,
        willingnessAverage: 4
      },
      2: {
        name: 'SkillTwo',
        proficiencies: [1, 5],
        willingness: [0, 5],
        proficiencyAverage: 3,
        willingnessAverage: 2.5
      }
    }
    const getters = {
      skills: () => mockSkills,
      skillProfiles: () => mockSkillProfiles
    }
    const store = createStore({ getters })
    const wrapper = createWrapper({ store })
    expect(wrapper.vm.skillInfo).toEqual(expected)
  })
})
