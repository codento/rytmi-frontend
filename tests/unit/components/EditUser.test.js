import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import EditUser from '@/components/Admin/EditUser'

describe('EditUser.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  const getters = {
    profileByUserId: () => (arg) => {
      return {
        id: 1,
        userId: 2,
        firstName: 'Bar',
        lastName: 'Foo',
        photoPath: '',
        employeeRoles: [1],
        title: 'software developer',
        accounts: [
          {
            address: 'twitter.com/foo'
          },
          {
            address: 'github.com/bar'
          }
        ],
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
    }
  }

  const propsData = {
    user: {
      id: 1,
      firstName: 'Bar',
      lastName: 'Foo',
      active: false,
      admin: false
    },
    update: jest.fn(),
    delete: jest.fn()
  }

  let wrapper, store

  beforeEach(() => {
    store = new Vuex.Store({ getters })
    wrapper = mount(EditUser, {
      store,
      propsData,
      localVue
    })
  })

  it('Template is correct', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
