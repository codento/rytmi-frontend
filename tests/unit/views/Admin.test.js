import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import View from '@/views/Admin.vue'

describe('Admin.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  let store, getters, wrapper

  beforeEach(() => {
    getters = {
      users: () => {
        return {
          1: {
            id: 1,
            firstName: 'Bar',
            lastName: 'Foo',
            active: true,
            admin: true
          },
          2: {
            id: 2,
            firstName: 'Oof',
            lastName: 'Rab',
            active: true,
            admin: true
          },
          3: {
            id: 3,
            firstName: 'Abr',
            lastName: 'Ofo',
            active: false,
            admin: true
          },
          4: {
            id: 4,
            firstName: 'Rba',
            lastName: 'Off',
            active: true,
            admin: false
          }
        }
      },
      profileByUserId: () => (arg) => {
        return {
          id: arg,
          userId: 1,
          firstName: 'Bar',
          lastName: 'Foo',
          photoPath: '',
          employeeRoles: [1],
          title: 'software developer',
          email: 'foo.bar@foo.com',
          phone: '1354',
          description: 'fdas'
        }
      },
      employeeRoles: () => {
        return [
          { id: 1, title: 'soft mengineer' },
          { id: 2, title: 'hardcore soft engineer' }
        ]
      },
      absencesByProfileId: () => (id) => {},
      leaves: () => []
    }
    const actions = {
      fetchAbsencesForProfile: () => (id) => {}
    }

    store = new Vuex.Store({ getters, actions })
    wrapper = mount(View, {
      store,
      localVue
    })
  })

  it('Template is correct', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('Renders user list with correct amount of users', () => {
    const users = wrapper.findAll('.list-group-item')
    expect(users.length).toBe(4)
  })

  it('Renders renders EditUser when a user is selected', () => {
    wrapper.vm.setUser(1)
    expect(wrapper.find('#edit-user-card').exists()).toBeTruthy()
  })
})
