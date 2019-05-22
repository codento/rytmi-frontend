import _ from 'lodash'

import {
  CvTool,
  CvToolProfile,
  CvToolSkills,
  CvToolWorkExperience,
  CvToolEducation
} from '@/components/Profile'
import { getters } from '@/store/modules/cvTool/getters'

import { createShallowWrapper } from './setup/setup'
import { mockProfile, mockProject, mockProfileProject } from './setup/mockData'

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
  skillCategoryBySkillId: () => (skillId) => {
    return {
      id: 1,
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
  skillGroupBySkillId: () => (skillId) => {
    return {
      id: 1,
      name: 'Software development',
      description: 'Software development desc'
    }
  },
  profileProjectsByProfileId: () => (profileId) => {
    return [mockProfileProject]
  },
  projectById: () => (projectId) => {
    return mockProject
  }
}

const initialState = {
  cvIntroduction: '',
  topSkills: [],
  topProjects: [],
  cvExportPending: false
}

const storeConfig = {
  state: initialState,
  getters: _.merge({}, getters, mockGetters)
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
    const skillsWrapper = wrapper.find(CvToolSkills)
    const projectsWrapper = wrapper.find(CvToolWorkExperience)
    const educationWrapper = wrapper.find(CvToolEducation)
    expect(profileWrapper.isVisible()).toBeTruthy()
    expect(profileWrapper.props().profile).toEqual(mockProfile)
    expect(skillsWrapper.isVisible()).toBeTruthy()
    expect(projectsWrapper.isVisible()).toBeTruthy()
    expect(educationWrapper.isVisible()).toBeTruthy()
    expect(educationWrapper.props().educationList).toEqual(mockProfile.education)
  })

  it('Should disable button if inputs are not valid', () => {
    const wrapper = createShallowWrapper(CvTool, storeConfig, additionalMountingOptions)
    const button = wrapper.find('#open-create-cv-modal')
    expect(button.html().includes('disabled')).toBeTruthy()
  })
})

describe('CvTool.test.js', () => {
  const overrideState = {
    state: {
      cvIntroduction: 'Test introduction',
      topSkills: [
        {
          id: 1,
          name: 'Python',
          description: 'Python desc'
        }
      ],
      topProjects: [
        {
          id: mockProfileProject.id,
          profile: mockProfile.id,
          projectId: mockProfileProject.projectId,
          startDate: mockProfileProject.startDate,
          endDate: mockProfileProject.endDate,
          title: mockProfileProject.endDate,
          name: mockProject.name,
          description: mockProject.description,
          customerName: mockProject.customerName,
          duration: '01/2018-02/2018'
        }
      ]
    }
  }

  it('Should enable button if inputs are valid', () => {
    const wrapper = createShallowWrapper(CvTool, _.merge({}, storeConfig, overrideState), additionalMountingOptions)
    // isIntroductionValid is updated first when child component CvToolProfile is created -> mock by setting it manually here
    wrapper.setData({ isIntroductionValid: true })
    const openModalButton = wrapper.find('#open-create-cv-modal')
    expect(openModalButton.html().includes('disabled')).toBeFalsy()
    openModalButton.trigger('click')
    // Should open modal
    expect(wrapper.find('#create-cv-modal').isVisible()).toBeTruthy()
  })
})
