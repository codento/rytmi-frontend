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

export const mockProfileProject = {
  id: 1,
  profile: mockProfile.id,
  projectId: 11,
  startDate: '2018-01-01',
  endDate: '2018-02-01',
  title: 'Developer',
  descriptions: [
    {
      title: 'Developer',
      language: 'en'
    },
    {
      title: 'Devaaja',
      language: 'fi'
    }
  ]
}

export const mockProject = {
  id: 11,
  name: 'Project Foo',
  description: 'Foo Bar',
  descriptions: [
    {
      name: 'Project Foo (en)',
      customerName: 'Customer',
      description: 'Foo Bar (en)',
      language: 'en'
    },
    {
      name: 'Projekti Foo (fi)',
      customerName: 'Asiakas',
      description: 'Foo Bar (fi)',
      language: 'fi'
    }
  ]
}
