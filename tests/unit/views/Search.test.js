import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Search from '@/views/Search.vue'
import { Results } from '@/components/Search'
import Loading from '@/components/helpers/LoadingSpinner'
import vSelect from 'vue-select'
import { LANGUAGE_ENUM } from '@/utils/constants'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('loading', Loading)
localVue.component('vSelect', vSelect)

function skillsMock () {
  return {
    1: { id: 1, name: 'Python' },
    2: { id: 2, name: 'JavaScript' },
    3: { id: 3, name: 'Scala' },
    4: { id: 4, name: 'some natural language' }
  }
}

const mockSkillGroups = {
  1: { id: 100, title: { en: 'SomeGroup', fi: 'SomeGroup' } },
  2: { id: 100, title: { en: 'SomeGroup', fi: 'SomeGroup' } },
  3: { id: 100, title: { en: 'SomeGroup', fi: 'SomeGroup' } },
  4: { id: 200, title: { en: LANGUAGE_ENUM.LANGUAGE_GROUP_NAME, fi: '' } }
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => skillsMock(),
      skillName: () => (skillId) => skillsMock()[skillId],
      employeeRoles: () => {
        return [
          { id: 1, title: 'soft engineer' },
          { id: 2, title: 'hardcore soft engineer' }
        ]
      },
      skillFilter: () => [],
      skillGroupBySkillId: () => (id) => mockSkillGroups[id]
    },
    actions: {
      updateSkillFilter: jest.fn(() => [])
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
  return shallowMount(Search, mergedMountingOptions)
}

describe('Search.vue', () => {
  it('should have all skills in the skill filter select', () => {
    const wrapper = createWrapper()
    const numSkillsNoLanguages = Object.keys(skillsMock()).length - 1
    expect(wrapper.findAll(vSelect).at(1).props().options.length).toBe(numSkillsNoLanguages)
  })

  it('should pass right attributes to Results component', () => {
    const wrapper = createWrapper()
    const skill = skillsMock()[1]
    wrapper.vm.selectedSkills = [{ label: skill.name, id: skill.id }]
    wrapper.vm.nameFilter = 'foo'
    expect(wrapper.find(Results).props().skillFilters).toEqual([skillsMock()[1]])
    expect(wrapper.find(Results).props().nameFilter).toBe('foo')
  })
})
