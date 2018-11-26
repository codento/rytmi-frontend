import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { merge, filter, isEmpty } from 'lodash'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { Results, ProfileCard } from '@/components/Search'
import Loading from '@/components/helpers/LoadingSpinner'

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

const profileProjectsMock = {
  1: { projectId: 1, profileId: 1, startDate: '2018-12-13T12:49:21.289Z', endDate: '2019-07-19T18:16:06.623Z', workPercentage: 20 },
  2: { projectId: 1, profileId: 2, startDate: '2018-12-13T12:49:21.289Z', endDate: '2019-07-19T18:16:06.623Z', workPercentage: 20 },
  3: { projectId: 2, profileId: 3, startDate: '2018-09-02T05:06:12.704Z', endDate: '2018-11-21T12:42:13.818Z', workPercentage: 50 },
  4: { projectId: 3, profileId: 3, startDate: '2018-11-23', endDate: null, workPercentage: 20 } // No endDate, continues indefinitely
}

const sortAttributeEnum = Object.freeze({ name: 1, wantsTo: 2, knows: 3 })

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skills: () => skillsMock,
      profileFilter: () => (name) => !isEmpty(name) ? filter(profilesMock, profile => profile.firstName === name) : Object.values(profilesMock),
      skillsByProfileId: () => (profileId) => filter(profileSkills, ps => ps.profileId === profileId),
      profiles: () => profilesMock,
      futureProjectsOfProfile: () => (profileId) => filter(profileProjectsMock, project => project.profileId === profileId)
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
        skillFilters: [],
        nameFilter: ''
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
        skillFilters: [],
        nameFilter: 'Joe'
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
        skillFilters: [{ id: 1, name: 'Python' }, { id: 2, name: 'JavaScript' }],
        nameFilter: ''
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
        skillFilters: [{ id: 3, name: 'Scala' }],
        nameFilter: ''
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
        skillFilters: [{ id: 3, name: 'Scala' }],
        nameFilter: ''
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

  it('should show profiles filtered by utilization date, sorted alphabetically (1)', (done) => {
    const mountOptions = {
      propsData: {
        skillFilters: [],
        nameFilter: '',
        utilizationDateFilter: '2019-10-30'
      }
    }
    const expectedOrder = ['Joe', 'Sarah']
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

  it('should show profiles filtered by utilization date, sorted alphabetically (2)', (done) => {
    const mountOptions = {
      propsData: {
        skillFilters: [],
        nameFilter: '',
        utilizationDateFilter: '2018-11-22'
      }
    }
    const expectedOrder = ['Daisy', 'Joe', 'Sarah']
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(3)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })

  it('should show profiles filtered by utilization date, sorted alphabetically (3)', (done) => {
    const mountOptions = {
      propsData: {
        skillFilters: [],
        nameFilter: '',
        utilizationDateFilter: '2018-12-13'
      }
    }
    const expectedOrder = []
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(0)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })

  it('should show profiles filtered by skill and utilization date', (done) => {
    const mountOptions = {
      propsData: {
        skillFilters: [{ id: 2, name: 'JavaScript' }],
        nameFilter: '',
        utilizationDateFilter: '2018-10-22'
      }
    }
    const expectedOrder = ['Joe']
    const wrapper = createWrapper(mountOptions)
    wrapper.vm.$nextTick(() => {
      const cards = wrapper.findAll(ProfileCard)
      expect(cards).toHaveLength(1)
      cards.wrappers.forEach((wrapper, i) => {
        expect(wrapper.props().profile.firstName).toBe(expectedOrder[i])
      })
      done()
    })
  })
})
