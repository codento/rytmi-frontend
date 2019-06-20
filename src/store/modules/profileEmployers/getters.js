export default {
  profileEmployers: state => state.profileEmployers,
  profileEmployersByProfileId: state => profileId => {
    return state.profileEmployers ? Object.values(state.profileEmployers).filter(profileEmployer => profileEmployer.profileId === profileId) : []
  }
}
