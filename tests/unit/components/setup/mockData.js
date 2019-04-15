export const mockProfile = {
  id: 2,
  birthday: '1984-04-01T21:18:33.442Z',
  firstName: 'Foo',
  lastName: 'Bar',
  role: 'Employee role',
  title: 'Title',
  phone: '+123 (1) 1234',
  description: 'Description about me Foo',
  email: 'foo.bar@barfoo.com',
  employeeRoles: [1],
  cvDescriptions: [
    { description: 'kuvaus1', language: 'fi', type: 'introduction' },
    { description: 'desc1', language: 'en', type: 'introduction' },
    { description: 'markdown kuvaus', language: 'fi', type: 'other' },
    { description: 'markdown desc', language: 'en', type: 'other' }
  ],
  introduction: 'kuvaus1',
  otherInfo: 'markdown kuvaus'
}

export const mockGetters = {
  getters: {
    currentLanguage: () => { return 'fi' },
    skillsByProfileId: () => (profileId) => {
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
    skillFilter: () => { return [] },
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

export const mockActions = {
  actions: {
    updateCvIntroduction: jest.fn(() => [])
  }
}
