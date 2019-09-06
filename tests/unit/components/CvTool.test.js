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
import { mockProfile, mockProject, mockProfileProject, mockEmployer } from './setup/mockData'

const mockGetters = {
  profileSkillsByProfileId: () => (profileId) => {
    return [
      {
        id: 1,
        skillId: 11,
        profileId: profileId,
        name: 'Python',
        description: 'Python desc',
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
      title: { en: 'Programming', fi: 'Programming' },
      description: 'Programming desc'
    }
  },
  skillCategoryBySkillId: () => (skillId) => {
    return {
      id: 1,
      title: { en: 'Programming', fi: 'Programming' },
      description: 'Programming desc'
    }
  },
  skillGroupById: () => (skillGroupById) => {
    return {
      id: skillGroupById,
      title: { en: 'Software development', fi: 'Sovelluskehitys' },
      description: 'Software development desc'
    }
  },
  skillGroupBySkillId: () => (skillId) => {
    return {
      id: 1,
      title: { en: 'Software development', fi: 'Sovelluskehitys' },
      description: 'Software development desc'
    }
  },
  profileProjectsByProfileId: () => (profileId) => {
    return [mockProfileProject]
  },
  projectById: () => (projectId) => {
    return mockProject
  },
  employerByName: () => (name) => {
    return mockEmployer
  },
  profileEmployersByProfileId: () => (profileId) => {
    return [
      {
        employerId: 1,
        title: { en: 'Software developer', fi: 'Sovelluskehittäjä' }
      }
    ]
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
})

describe('CvTool.test.js', () => {
  // const overrideState = {
  //   state: {
  //     cvIntroduction: 'Test introduction',
  //     topSkills: [
  //       {
  //         id: 1,
  //         name: 'Python',
  //         description: 'Python desc'
  //       }
  //     ],
  //     topProjects: [
  //       {
  //         id: mockProfileProject.id,
  //         profile: mockProfile.id,
  //         projectId: mockProfileProject.projectId,
  //         startDate: mockProfileProject.startDate,
  //         endDate: mockProfileProject.endDate,
  //         title: mockProfileProject.endDate,
  //         name: mockProject.name,
  //         description: mockProject.description,
  //         customerName: mockProject.customerName,
  //         duration: '01/2018-02/2018'
  //       }
  //     ]
  //   }
  // }
})
