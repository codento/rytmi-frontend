import {
  shallow,
  mount
} from 'vue-test-utils'
import { UserProfileCard } from '../../src/components/Profile'

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(UserProfileCard, {
      propsData: {
        profile: {
          name: 'test',
          email: 'mail',
          phone: '1231123',
          mail: 'mail@mail.comi',
          accounts: null,
          photoPath: 'shouldNotWork'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
