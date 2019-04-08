import { shallowMount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import { format } from 'date-fns'
import {
  CvTool,
  CvToolProfile,
  CvToolSkills,
  CvToolWorkExperience,
  CvToolOtherInfo
} from '@/components/Profile'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)
localVue.filter('dateFilter', value => {
  return value ? format(value, 'D.M.YYYY') : undefined
})

function createStore (overrideConfig) {
  const defaultStoreConfig = {
    getters: {
      skillsByProfileId: () => (profileId) => {
        return [
          {
            id: 1,
            name: 'Python',
            description: 'Python desc',
            visibleInCv: true,
            knows: 3
          }
        ]
      },
      skillById: () => (skillId) => {
        return {
          id: skillId,
          name: 'Python',
          description: 'Python desc'
        }
      },
      skillCategoryById: () => (skillCategoryId) => {
        return {
          id: skillCategoryId,
          name: 'Programming',
          description: 'Programming desc'
        }
      },
      skillGroupById: () => (skillGroupById) => {
        return {
          id: skillGroupById,
          name: 'Software development',
          description: 'Software development desc'
        }
      },
      profileProjectsByProfileId: () => (profileId) => {
        return [
          {
            id: 1,
            profile: profileId,
            projectId: 1,
            startDate: '2018-01-01',
            endDate: '2018-02-01'
          }
        ]
      },
      projectById: () => (projectId) => {
        return {
          id: projectId,
          name: 'Project Foo',
          description: 'Foo Bar',
          descriptions: [
            {
              name: 'Project Foo (en)',
              description: 'Foo Bar (en)',
              language: 'en'
            },
            {
              name: 'Project Foo (fi)',
              description: 'Foo Bar (fi)',
              language: 'fi'
            }
          ]
        }
      }
    }
  }
  const mergedConfig = merge(defaultStoreConfig, overrideConfig)
  return new Vuex.Store(mergedConfig)
}

function createWrapper (overrideMountingOptions) {
  const defaultMountingOptions = {
    localVue,
    store: createStore()
  }
  const mergedMountingOptions = merge(defaultMountingOptions, overrideMountingOptions)
  return shallowMount(CvTool, mergedMountingOptions)
}

const mockProfile = {
  id: 2,
  firstName: 'Foo',
  lastName: 'Bar',
  role: 'Employee role',
  title: 'Title',
  phone: 1234,
  description: 'Description about me Foo',
  email: 'foo.bar@barfoo.com',
  employeeRoles: [1]
}

describe('CvTool.test.js', () => {
  it('Should show correct components', () => {
    const propsData = {
      profile: mockProfile
    }
    const wrapper = createWrapper({ propsData })
    const profileWrapper = wrapper.find(CvToolProfile)
    const SkillsWrapper = wrapper.find(CvToolSkills)
    const ProjectsWrapper = wrapper.find(CvToolWorkExperience)
    const OtherInfoWrapper = wrapper.find(CvToolOtherInfo)
    expect(profileWrapper.isVisible()).toBeTruthy()
    expect(profileWrapper.props().profile).toEqual(mockProfile)
    expect(profileWrapper.props().relevantSkills).toEqual([])
    expect(profileWrapper.props().relevantProjects).toEqual([])
    expect(SkillsWrapper.isVisible()).toBeTruthy()
    expect(ProjectsWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.props().profile).toEqual(mockProfile)
  })
})
