import {
  mount
} from 'vue-test-utils'
import SkillRow from '../../src/components/SkillRow.vue'

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(SkillRow, {
      propsData: {
        basicInformation: {
          proficiency: 121231312,
          name: 'mail'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
