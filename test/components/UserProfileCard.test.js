import {
  shallow,
  mount
} from 'vue-test-utils'
import UserProfileCard from '../../src/components/UserProfileCard.vue'

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(UserProfileCard, {
      propsData: {
        basicInfo: {
          name: 'test',
          email: 'mail',
          phone: '1231123',
          mail: 'mail@mail.comi',
          accounts: null
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
