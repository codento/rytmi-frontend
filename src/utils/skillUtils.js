const options = {
  knows: [
    { value: null, text: 'Please select some item' },
    { value: 0, text: 'No Can Do' },
    { value: 1, text: 'Alkeet' },
    { value: 2, text: 'Duunari' },
    { value: 3, text: 'Seniori' },
    { value: 4, text: 'Arkkitehti' },
    { value: 5, text: 'Guru' }
  ],
  wants: [
    { value: null, text: 'Please select some item' },
    { value: 0, text: 'Ei halua' },
    { value: 1, text: 'Ei mielellää' },
    { value: 2, text: 'Tänne ja heti' }
  ]
}

const skills = [
  'React', 'Javascript', 'Typescript', 'ArnoldC', 'Lolcode', 'Befunge', 'Haskell', 'Fortran', 'Cuda', 'Python'
]
const exports = {
  getWantsOptions: () => {
    return options.wants
  },
  getKnowledgeOptions: () => {
    return options.knows
  },
  getKnowledge: (knows) => {
    switch (knows) {
      case 1:
        return { text: 'Alkeet', class: 'text-warning' }
      case 2:
        return { text: 'Duunari', class: 'text-primary' }
      case 3:
        return { text: 'Seniori', class: 'text-primary' }
      case 4:
        return { text: 'Arkkitehti', class: 'text-success' }
      case 5:
        return { text: 'Guru', class: 'text-success' }
      default:
        return { text: 'Ei osaa', class: 'text-warning' }
    }
  },
  getWants: (wantsTo) => {
    switch (wantsTo) {
      case 0:
        return { text: 'En halua tehdä', class: 'text-danger' }
      case 1:
        return { text: 'Voin tehdä varauksella', class: 'text-primary' }
      case 2:
        return { text: 'Haluan tehdä', class: 'text-success' }
      default:
        return { text: 'Arvoa ei ole annettu', class: 'text-warning' }
    }
  },
  getSkills: () => {
    return skills
  }
}
export default exports
