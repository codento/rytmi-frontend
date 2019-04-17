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
