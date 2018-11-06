import { mount } from '@vue/test-utils'
import { SkillForm } from '@/components/Skills'

describe('SkillForm.test.js', () => {
  it('Template is correct', () => {
    let wrapper = mount(SkillForm, {})
    expect(wrapper.html()).toMatchSnapshot()
  })
})