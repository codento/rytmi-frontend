import { mount } from 'vue-test-utils'
import { ProjectRow } from '../../src/components/Profile'

describe('UserProfileCard.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(ProjectRow, {
      propsData: {
        project: {
          projectName: 'Testi prkkis',
          title: 'mail',
          projectStartDate: '15.05.2017',
          projectEndDate: '16.06.2017',
          projectprojectDescription: 'Hipster ipsum'
        }
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
