export default {
  profileEmployers: state => state.profileEmployers,
  profileEmployersByProfileId: state => profileId => {
    return Object.values(state.profileEmployers).filter(profileEmployer => profileEmployer.profileId === profileId)
  }
}
