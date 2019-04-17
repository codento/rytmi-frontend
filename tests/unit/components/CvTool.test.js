import _ from 'lodash'

import {
  CvTool,
  CvToolProfile,
  CvToolSkills,
  CvToolWorkExperience,
  CvToolOtherInfo
} from '@/components/Profile'
import { state, getters, actions, mutations } from '@/store/modules/cvTool/index'

import { createShallowWrapper } from './setup/setup'
import { mockProfile } from './setup/mockData'

const mockGetters = {
  profileSkillsByProfileId: () => (profileId) => {
    return [
      {
        id: 1,
        skillId: 11,
        profileId: profileId,
        name: 'Python',
        description: 'Python desc',
        visibleInCv: true,
        knows: 3,
        wantsTo: 1
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

const storeConfig = {
  state: state,
  getters: _.merge(getters, mockGetters),
  actions: actions,
  mutations: mutations
}

const additionalMountingOptions = {
  propsData: {
    profile: mockProfile
  }
}

describe('CvTool.test.js', () => {
  it('Should show correct components', () => {
    const wrapper = createShallowWrapper(CvTool, storeConfig, additionalMountingOptions)
    const profileWrapper = wrapper.find(CvToolProfile)
    const SkillsWrapper = wrapper.find(CvToolSkills)
    const ProjectsWrapper = wrapper.find(CvToolWorkExperience)
    const OtherInfoWrapper = wrapper.find(CvToolOtherInfo)
    expect(profileWrapper.isVisible()).toBeTruthy()
    expect(profileWrapper.props().profile).toEqual(mockProfile)
    expect(SkillsWrapper.isVisible()).toBeTruthy()
    expect(ProjectsWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.isVisible()).toBeTruthy()
    expect(OtherInfoWrapper.props().profile).toEqual(mockProfile)
  })

  it('Should disable button if inputs are not valid', () => {
    const wrapper = createShallowWrapper(CvTool, storeConfig, additionalMountingOptions)
    const button = wrapper.find('#create-cv-button')
    expect(button.find('disabled')).toBeTruthy()
  })
})
