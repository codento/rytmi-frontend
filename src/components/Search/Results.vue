<template>
  <div>
    <b-row
      class="sortbar"
      align-h="end"
    >
      <b-col
        cols="12"
        class="text-right"
      >
        <small>Sort profiles by: </small>
        <b-form-radio-group
          id="btnradios"
          v-model="sortAttribute"
          :options="sortOptions"
          buttons
          name="radioBtnStacked" />
      </b-col>
    </b-row>
    <profile-card
      v-for="profile in orderedProfiles"
      :key="profile.id"
      :profile="profile"
      :skill-highlight="filteredSkillIds"
    />
  </div>
</template>

<script>
import { isEmpty, sortBy, mean } from 'lodash'
import { mapGetters } from 'vuex'
import ProfileCard from './ProfileCard'
const sortAttributeEnum = Object.freeze({ name: 1, wantsTo: 2, knows: 3 })

export default {
  name: 'Results',
  components: {
    ProfileCard
  },
  props: {
    filterName: String,
    filterSkills: Array
  },
  data () {
    return {
      filteredProfiles: {},
      sortAttribute: sortAttributeEnum.name,
      profilesWithSkills: null
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByProfileId',
      'profiles'
    ]),
    sortOptions () {
      const options = [
        { text: 'Name', value: sortAttributeEnum.name }
      ]
      if (!isEmpty(this.filterSkills)) {
        options.push(...[
          { text: 'Proficiency', value: sortAttributeEnum.knows },
          { text: 'Willingness', value: sortAttributeEnum.wantsTo }
        ])
      }
      return options
    },
    filteredSkillIds () {
      return this.filterSkills.map(skill => skill.id)
    },
    orderedProfiles () {
      // Every profile with skills, already filtered by name
      let filteredProfilesWithSkills = this.mapSkillsToProfiles()

      // Filter by skill(s)
      this.filteredSkillIds.forEach(skillId => {
        filteredProfilesWithSkills = this.getProfilesBySkill(filteredProfilesWithSkills, skillId)
      })

      // Sort profiles
      filteredProfilesWithSkills = this.sortProfiles(filteredProfilesWithSkills)

      // Mapped skills aren't needed anymore from this point on, return only profiles
      return filteredProfilesWithSkills.map(profileWithSkills => profileWithSkills.profile)
    }
  },
  methods: {
    getProfilesBySkill (profilesToFilter, skillId) {
      return profilesToFilter.filter(profile => profile.skills.map(skill => skill.skillId).includes(skillId))
    },
    mapSkillsToProfiles () {
      // First, get profiles, filtered by name
      const profilesWithoutSkills = Object.values(this.profileFilter(this.filterName))
      // Then map skills for each profile
      const profilesWithSkills = []
      profilesWithoutSkills.forEach(profile => {
        profilesWithSkills.push({
          profile: profile,
          skills: this.skillsByProfileId(profile.id)
        })
      })
      return profilesWithSkills
    },
    sortProfiles (profilesWithSkills) {
      if (this.sortAttribute === sortAttributeEnum.name) {
        return sortBy(profilesWithSkills, ['profile.firstName'])
      }
      // When sorting by proficiency or willingness, base a person's position on the average value (avg. willingness or avg. proficiency) of the filtered skills
      if (this.sortAttribute === sortAttributeEnum.wantsTo || this.sortAttribute === sortAttributeEnum.knows) {
        if (this.filteredSkillIds.length < 1) {
          return profilesWithSkills
        }
        const propertyToSortBy = (this.sortAttribute === sortAttributeEnum.wantsTo ? 'wantsTo' : 'knows')
        return profilesWithSkills.sort((profile1, profile2) => {
          const profile1AverageOfFilteredSkillLevels = profileProfilesAverageOfFilteredSkillLevels(profile1, this.filteredSkillIds, propertyToSortBy)
          const profile2AverageOfFilteredSkillLevels = profileProfilesAverageOfFilteredSkillLevels(profile2, this.filteredSkillIds, propertyToSortBy)
          return profile2AverageOfFilteredSkillLevels - profile1AverageOfFilteredSkillLevels
        })
      }

      function profileProfilesAverageOfFilteredSkillLevels (profile, skillIds, propertyToReturn) {
        return mean(profile.skills.filter(skill => skillIds.includes(skill.skillId)).map(skill => skill[propertyToReturn]))
      }
    }
  }
}
</script>

<style scoped>
.sortbar {
  padding: 8px !important;
}
</style>
