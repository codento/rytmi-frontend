import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge, filter, isEmpty } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { Results, ProfileCard } from '@/components/Search'
import Loading from '@/components/lib/loading'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.component('loading', Loading)

const profilesMock = {
  1: { id: 1, firstName: 'Joe' }, // Python(1,2), JavaScript(3,4)
  2: { id: 2, firstName: 'Sarah' }, // Python(2,3), Scala(1,4)
  3: { id: 3, firstName: 'Daisy' } // Python(5,4), JavaScript(3,3), Scala(2,2)
}

const skillsMock = {
  1: { id: 1, name: 'Python' },
  2: { id: 2, name: 'JavaScript' },
  3: { id: 3, name: 'Scala' }
}

const profileSkills = {
  1: { id: 1, profileId: 1, skillId: 1, knows: 1, wantsTo: 2 },
  2: { id: 2, profileId: 1, skillId: 2, knows: 3, wantsTo: 4 },
  3: { id: 3, profileId: 2, skillId: 1, knows: 2, wantsTo: 3 },
  4: { id: 4, profileId: 2, skillId: 3, knows: 1, wantsTo: 4 },
  5: { id: 5, profileId: 3, skillId: 1, knows: 5, wantsTo: 4 },
  6: { id: 6, profileId: 3, skillId: 2, knows: 3, wantsTo: 3 },
  7: { id: 7, profileId: 3, skillId: 3, knows: 2, wantsTo: 2 }
}

const sortAttributeEnum = Object.freeze({ name: 1, wantsTo: 2, knows: 3 })

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => skillsMock,
      profileFilter: () => (name) => !isEmpty(name) ? filter(profilesMock, profile => profile.firstName === name) : Object.values(profilesMock),
      skillsByProfileId: () => (profileId) => filter(profileSkills, ps => ps.profileId === profileId),
      profiles: () => profilesMock
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
  return shallowMount(Results, mergedMountingOptions)
}

describe('Results.vue', () => {
  it('should show all profiles sorted by name', (done) => {
    const mountOptions = {
      propsData: {
        filterSkills: [],
        filterName: ''
      }
    }
    const expectedOrder = Object.values(profilesMock).map(profile => profile.firstName).sort()
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(Object.keys(profilesMock).length)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })

  it('should show only filteres profiles when filtered by name', (done) => {
    const mountOptions = {
      propsData: {
        filterSkills: [],
        filterName: 'Joe'
      }
    }
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(1)
      expect(cards.at(0).props().profile.firstName).toBe('Joe')
      done()
    })
  })

  it('should show only filtered profiles when filtered by skills', (done) => {
    const mountOptions = {
      propsData: {
        filterSkills: [{ id: 1, name: 'Python' }, { id: 2, name: 'JavaScript' }],
        filterName: ''
      }
    }
    const expectedOrder = ['Daisy', 'Joe']
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(2)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })

  it('should show profiles ordered by willingness level for a skill', (done) => {
    const mountOptions = {
      propsData: {
        filterSkills: [{ id: 3, name: 'Scala' }],
        filterName: ''
      }
    }
    const expectedOrder = ['Sarah', 'Daisy']
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ sortAttribute: sortAttributeEnum.wantsTo })
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(2)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })

  it('should show profiles ordered by knowledge level for a skill', (done) => {
    const mountOptions = {
      propsData: {
        filterSkills: [{ id: 3, name: 'Scala' }],
        filterName: ''
      }
    }
    const expectedOrder = ['Daisy', 'Sarah']
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      wrapper.setData({ sortAttribute: sortAttributeEnum.knows })
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(2)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })
})
