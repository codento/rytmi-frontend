jest.mock('lodash', () => ({
  orderBy: jest.fn(() => {
    return [{
      name: 'Vue.js',
      knows: 0,
      wantsTo: 2,
      id: 7
    }]
  })
}))

import { shallow, createLocalVue } from 'vue-test-utils'
import View from '../../src/views/Profile.vue'
import lodash from 'lodash'

describe('Profile.test.js', () => {
  let cmp
  let $lodash = lodash
  beforeEach(() => {
    let localVue = createLocalVue()
    cmp = shallow(View, {
      localVue,
      mocks: {
        $lodash
      }
    })
  })
  it('Template is correct', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
