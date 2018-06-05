import { mount } from '@vue/test-utils'
import { ProjectForm } from '../../src/components/Project'

describe('ProjectForm.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(ProjectForm, {})
    expect(wrapper.html()).toMatchSnapshot()
  })
})
