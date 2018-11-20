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
      :skill-highlight="mapIdsOfSkillFilters"
    />
  </div>
</template>

<script>
import { isEmpty, sortBy, difference } from 'lodash'
import { mapGetters } from 'vuex'
import ProfileCard from './ProfileCard'
const sortAttributeEnum = Object.freeze({ name: 1, wantsTo: 2, knows: 3 })

const sortByName = (array) => sortBy(array, 'profile.firstName')

const calculateSkillAverage = (skills, skillFilters, attribute) => {
  return skills.filter((skill) => skillFilters.includes(skill.skillId))
    .reduce((accumulator, current) => accumulator + current[attribute], 0) / skillFilters.length
}

const sortArrayBy = (sortAttribute, skillFilters) => (profileOne, profileTwo) => {
  const profileOneAverage = calculateSkillAverage(profileOne.skills, skillFilters, sortAttribute)
  const profileTwoAverage = calculateSkillAverage(profileTwo.skills, skillFilters, sortAttribute)
  return profileTwoAverage - profileOneAverage
}

export default {
  name: 'Results',
  components: {
    ProfileCard
  },
  props: {
    nameFilter: String,
    skillFilters: Array
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
      const { name, knows, wantsTo } = sortAttributeEnum
      const options = [
        { text: 'Name', value: name }
      ]
      if (!isEmpty(this.skillFilters)) {
        options.push(...[
          { text: 'Proficiency', value: knows },
          { text: 'Willingness', value: wantsTo }
        ])
      }
      return options
    },
    mapIdsOfSkillFilters () {
      return this.skillFilters.map(skill => skill.id)
    },
    orderedProfiles () {
      const profilesWithSkills = this.mapSkillsToProfiles()
      let filteredProfilesWithSkills = this.getProfilesFilteredBySkills(profilesWithSkills, this.mapIdsOfSkillFilters)
      return this.getSortedProfiles(filteredProfilesWithSkills).map(profileWithSkills => profileWithSkills.profile)
    }
  },
  watch: {
    skillFilters: function () {
      // Set sorting attribute to name when last skill has been removed from skill filters
      if (this.skillFilters.length === 0) {
        this.sortAttribute = sortAttributeEnum.name
      }
    }
  },
  methods: {
    getProfilesFilteredBySkills (profilesToFilter, skillIds) {
      // Return profiles that have all the skills we're filtering for
      return profilesToFilter.filter(profile => difference(skillIds, profile.skills.map(skill => skill.skillId)).length === 0)
    },
    mapSkillsToProfiles () {
      // First, get profiles, filtered by name
      const profilesWithoutSkills = Object.values(this.profileFilter(this.nameFilter))
      // Then map skills for each profile
      return profilesWithoutSkills.map(profile => (
        {
          profile: profile,
          skills: this.skillsByProfileId(profile.id)
        })
      )
    },
    getSortedProfiles (profilesWithSkills) {
      const { name, wantsTo, knows } = sortAttributeEnum
      switch (this.sortAttribute) {
        case name:
          return sortByName(profilesWithSkills)
        case wantsTo:
          return profilesWithSkills.sort(sortArrayBy('wantsTo', this.mapIdsOfSkillFilters))
        case knows:
          return profilesWithSkills.sort(sortArrayBy('knows', this.mapIdsOfSkillFilters))
        default:
          return sortByName(profilesWithSkills)
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
