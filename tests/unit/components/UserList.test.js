import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import { createLocalVue, mount } from '@vue/test-utils'
import UserList from '@/components/Admin/UserList'

describe('UserList.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(BootstrapVue)

  const propsData = {
    users: {
      1: {
        id: 1,
        firstName: 'Aaa',
        lastName: 'Foo',
        active: true,
        admin: true
      },
      2: {
        id: 2,
        firstName: 'Bbb',
        lastName: 'Rab',
        active: true,
        admin: true
      },
      3: {
        id: 3,
        firstName: 'Ccc',
        lastName: 'Foo',
        active: false,
        admin: true
      },
      4: {
        id: 4,
        firstName: 'Ddd',
        lastName: 'Baru',
        active: true,
        admin: false
      }
    }
  }

  let wrapper

  beforeEach(() => {
    wrapper = mount(UserList, {
      propsData,
      localVue
    })
  })

  it('List is rendered with correct length', () => {
    const list = wrapper.findAll('.list-group-item')
    expect(list).toHaveLength(4)
  })

  it('should select user', () => {
    const selectUser = jest.spyOn(wrapper.vm, 'selectUser')
    const list = wrapper.findAll('.list-group-item')
    list.at(2).trigger('click')
    expect(wrapper.vm.selectedUserId).toBe(3)
    expect(selectUser).toHaveBeenCalled()
    expect(list.at(2).classes()).toContain('active')
  })

  it('Template is correct', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
