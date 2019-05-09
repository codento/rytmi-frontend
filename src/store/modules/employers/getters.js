export default {
  employers: state => state.employers,
  employerById: state => id => {
    return state.employers[id]
  },
  employersByProfileId: state => profileId => {
    return Object.values(state.employers).filter(employer => employer.profileId === profileId)
  }
}
