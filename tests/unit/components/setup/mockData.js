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
  introduction: {
    fi: 'kuvaus1',
    en: 'desc1'
  },
  education: [
    { fi: { school: 'Yliopisto', degree: 'Joku tutkinto', major: null, minor: null },
      en: { school: 'University', degree: 'Some degree', major: 'My major', minor: 'My minor' },
      startYear: 2011,
      endYear: 2015
    }
  ],
  otherInfo: 'markdown kuvaus'
}

export const mockProfileProject = {
  id: 1,
  profile: mockProfile.id,
  projectId: 11,
  startDate: '2018-01-01',
  endDate: '2018-02-01',
  role: { en: 'Developer', fi: 'Devaaja' }
}

export const mockProject = {
  id: 11,
  name: { en: 'Project Foo (en)', fi: 'Projekti Foo (fi)' },
  customerName: { en: 'Customer', fi: 'Asiakas' },
  description: { en: 'Foo Bar (en)', fi: 'Foo Bar (fi)' }
}
