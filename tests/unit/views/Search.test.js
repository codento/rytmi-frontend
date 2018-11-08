import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Search from '@/views/Search.vue'
import { Results } from '@/components/Search'
import Loading from '@/components/lib/loading'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('loading', Loading)

const bDropdownItemButton = localVue.options.components.bDropdownItemButton

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
      skillName: () => (skillId) => skillsMock()[skillId],
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
  it('shows all skills in dropdown', () => {
    const wrapper = createWrapper()
    expect(wrapper.findAll(bDropdownItemButton).length).toBe(Object.keys(skillsMock()).length)
  })

  it('should only show remaining skills after selection', () => {
    const wrapper = createWrapper()
    wrapper.vm.addToSearch(skillsMock()[1])
    expect(wrapper.findAll(bDropdownItemButton).length).toBe(Object.keys(skillsMock()).length - 1)
  })

  it('should only show remaining skills after removing selected skill', () => {
    const wrapper = createWrapper()
    wrapper.vm.addToSearch(skillsMock()[1])
    wrapper.vm.addToSearch(skillsMock()[2])
    wrapper.vm.removeFromSearch(skillsMock()[1])
    expect(wrapper.findAll(bDropdownItemButton).length).toBe(Object.keys(skillsMock()).length - 1)
  })

  it('should pass right attributes to Results component', () => {
    const wrapper = createWrapper()
    wrapper.vm.addToSearch(skillsMock()[1])
    wrapper.vm.filterName = 'foo'
    expect(wrapper.find(Results).props().filterSkills).toEqual([skillsMock()[1]])
    expect(wrapper.find(Results).props().filterName).toBe('foo')
  })
})
