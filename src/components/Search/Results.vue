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
          name="radioBtnStacked"
        />
        <b-btn
          id="reverse-order-btn"
          title="Reverse order"
          @click="reversedOrder = !reversedOrder"
        >
          <i
            :class="reversedOrder ? 'fa-chevron-up' : 'fa-chevron-down'"
            class="fa"
          />
        </b-btn>
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
import { isValid, startOfDay } from 'date-fns'
const sortAttributeEnum = Object.freeze({ name: 1, wantsTo: 2, knows: 3, utilization: 4 })

const sortArrayBy = (array, key) => sortBy(array, key)

const calculateSkillAverage = (skills, skillFilters, attribute) => {
  return skills.filter((skill) => skillFilters.includes(skill.skillId))
    .reduce((accumulator, current) => accumulator + current[attribute], 0) / skillFilters.length
}

const sortBySkills = (sortAttribute, skillFilters) => (profileOne, profileTwo) => {
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
    skillFilters: Array,
    utilizationDateFilter: Date,
    employeeRoleFilter: Array
  },
  data () {
    return {
      filteredProfiles: {},
      sortAttribute: sortAttributeEnum.name,
      profilesWithSkills: null,
      reversedOrder: false
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'skillsByProfileId',
      'profiles',
      'futureProjectsOfProfile',
      'profileProjectsByProfileId'
    ]),
    sortOptions () {
      const { name, knows, wantsTo, utilization } = sortAttributeEnum
      const options = [
        { text: 'Name', value: name },
        { text: 'Utilization', value: utilization }
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
      const profiles = this.mapSkillsAndProjectsToProfiles()
      const profilesFilteredBySkills = this.getProfilesFilteredBySkills(profiles, this.mapIdsOfSkillFilters)
      const profilesFilteredBySkillsAndUtilization = this.getProfilesFilteredByUtilization(profilesFilteredBySkills, this.utilizationDateFilter)
      const profilesFilteredBySkillsUtilizationAndEmployeeRole = this.getProfilesFilteredByEmployeeRole(profilesFilteredBySkillsAndUtilization)
      return this.getSortedProfiles(profilesFilteredBySkillsUtilizationAndEmployeeRole).map(profile => profile.profile)
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
    getProfilesFilteredByUtilization (profilesToFilter, utilizationDateFilter) {
      const getProjectsAtGivenTime = (projects, date) => projects.filter(project =>
        getOnlyDateFromFullDate(project.startDate) <= date &&
        (isEmpty(project.endDate) || getOnlyDateFromFullDate(project.endDate) >= date))
      const getOnlyDateFromFullDate = (date) => startOfDay(date)
      const parsedDate = getOnlyDateFromFullDate(utilizationDateFilter)

      if (isValid(parsedDate)) {
        return profilesToFilter.filter(profile => getProjectsAtGivenTime(profile.projects.filter(project => project.workPercentage > 0), parsedDate).length === 0)
      }
      return profilesToFilter
    },
    getProfilesFilteredByEmployeeRole (profilesToFilter) {
      const filteredProfiles = profilesToFilter.filter(profile => {
        return isEmpty(this.employeeRoleFilter)
          ? true
          : this.employeeRoleFilter.some(filter => profile.profile.employeeRoles.includes(filter.id))
      })
      return this.employeeRoleFilter
        ? filteredProfiles
        : profilesToFilter
    },
    mapSkillsAndProjectsToProfiles () {
      // First, get profiles, filtered by name
      const profilesWithoutSkills = Object.values(this.profileFilter(this.nameFilter))
      // Then map skills and projects for each profile
      return profilesWithoutSkills.map(profile => {
        let utilizationOnSelectedDate = 0
        this.futureProjectsOfProfile(profile.id).map(project => {
          utilizationOnSelectedDate += project.workPercentage
        })
        return {
          profile: profile,
          skills: this.skillsByProfileId(profile.id),
          projects: this.futureProjectsOfProfile(profile.id),
          utilization: utilizationOnSelectedDate
        }
      })
    },
    getSortedProfiles (profilesWithSkills) {
      const { name, wantsTo, knows, utilization } = sortAttributeEnum
      let profiles = []
      switch (this.sortAttribute) {
        case name:
          profiles = sortArrayBy(profilesWithSkills, 'profile.firstName')
          break
        case wantsTo:
          profiles = profilesWithSkills.sort(sortBySkills('wantsTo', this.mapIdsOfSkillFilters))
          break
        case knows:
          profiles = profilesWithSkills.sort(sortBySkills('knows', this.mapIdsOfSkillFilters))
          break
        case utilization:
          profiles = sortArrayBy(profilesWithSkills, 'utilization')
          break
        default:
          profiles = sortArrayBy(profilesWithSkills, 'profile.firstName')
          break
      }
      return this.reversedOrder ? profiles.reverse() : profiles
    }
  }
}
</script>

<style scoped>
.sortbar {
  padding: 8px !important;
}
</style>
