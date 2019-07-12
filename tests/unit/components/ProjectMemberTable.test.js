import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import flushPromises from 'flush-promises'
import { ProjectMemberTable } from '@/components/Project'
import { format } from 'date-fns'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      profileById: jest.fn((profileId) => () => ({
        firstName: 'Foo',
        lastName: 'Bar'
      })),
      isAdmin: () => () => true
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    mocks: {
      $toasted: {
        global: {
          rytmi_success: jest.fn(),
          rytmi_error: jest.fn()
        }
      }
    },
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return mount(ProjectMemberTable, mergedMountingOptions)
}

describe('ProjectMemberTable.vue', () => {
  it('shows nothing when there are no members', () => {
    const propsData = {
      members: null
    }
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find({ name: 'bTable' }).exists()).toBe(false)
  })

  it('shows btable with correct size when there are members', () => {
    const propsData = getMembersList()
    const wrapper = createWrapper({ propsData })
    expect(wrapper.find({ name: 'BTable' }).exists()).toBe(true)
    expect(wrapper.find('tbody').findAll('tr')).toHaveLength(propsData.members.length)
  })

  it('prints Profile not found when member id is invalid', () => {
    const getters = {
      profileById: () => () => { }
    }
    const propsData = getMembersList()
    const store = createStore({ getters })
    const wrapper = createWrapper({ store, propsData })
    expect(wrapper.find('tbody').text()).toContain('Profile not found')
  })

  it('navigates to profile when consultant name is clicked', () => {
    const $router = {
      push: jest.fn()
    }
    const propsData = getMembersList()
    const wrapper = createWrapper({ mocks: { $router }, propsData })
    const nameField = wrapper.find('td[data-label="Name"]')
    nameField.find('span').trigger('click')
    expect($router.push).toHaveBeenCalledWith(
      { name: 'profile', params: { id: propsData.members[0].profileId } })
  })

  it('dispatches removeProfileProject when removeMember is called and confirmed', async () => {
    expect.assertions(3)
    const confirmSpy = jest.spyOn(window, 'confirm')
    confirmSpy.mockImplementation(() => true)
    const propsData = getMembersList()
    const actions = {
      removeProfileProject: jest.fn(() => Promise.resolve())
    }
    const store = createStore({
      actions
    })
    const wrapper = createWrapper({ propsData, store })
    const removeProfileSpy = jest.spyOn(wrapper.vm, 'removeMember')
    wrapper.find('tbody').find('.btn-danger').trigger('click')
    await flushPromises()
    expect(removeProfileSpy).toHaveBeenCalledWith(propsData.members[0])
    expect(confirmSpy).toHaveBeenCalled()
    expect(actions.removeProfileProject).toHaveBeenCalled()
  })
})

function getMembersList () {
  return {
    members: [
      {
        id: 1,
        profileId: 1,
        projectId: 2,
        startDate: new Date('2018-01-01'),
        endDate: new Date('2018-02-01'),
        workPercentage: 45,
        role: { fi: 'Koodaaja', en: 'Coder' }
      }
    ]
  }
}
