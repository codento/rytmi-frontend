import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Search from '@/views/Search.vue'
import { Results } from '@/components/Search'
import Loading from '@/components/helpers/LoadingSpinner'
import vSelect from "vue-select"

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
    4: { id: 4, name: 'Go' }
  }
}

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => skillsMock(),
      skillName: () => (skillId) => skillsMock()[skillId]
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
    expect(wrapper.find(vSelect).props().options.length).toBe(Object.keys(skillsMock()).length)
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
