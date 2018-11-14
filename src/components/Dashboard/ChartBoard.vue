<template>
  <div>
    <b-row>
      <b-col>
        <h2>Dashboard</h2>
      </b-col>
    </b-row>
    <loading-spinner v-if="!appInitialized" />
    <div v-else>
      <div v-if="skillList.length === 0 || skillProfiles.length === 0">
        <span id="no-data-message">Sorry there is no data to display :(</span>
      </div>
      <div v-else>
        <b-row class="no-gutters mt-1">
          <top-skill-chart
            :skill-info="skillInfo"
            :size="5" />
          <most-willingness-chart
            :skill-info="skillInfo"
            :size="5" />
        </b-row>
        <b-row class="no-gutters mt-1">
          <skill-chart
            v-if="appInitialized"
            :skills="skills"
            :skill-info="skillInfo"
            :profile-list="profileList"
            class="pb-1"/>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoadingSpinner from '../helpers/LoadingSpinner'
import ChartCard from './ChartCard'
import SkillChart from './SkillChart'
import TopSkillChart from './TopSkillChart'
import MostWillingnessChart from './MostWillingnessChart'

export default {
  components: {
    LoadingSpinner,
    ChartCard,
    SkillChart,
    TopSkillChart,
    MostWillingnessChart
  },
  computed: {
    ...mapGetters([
      'appInitialized',
      'skills',
      'skillProfiles',
      'profileList'
    ]),
    skillList () {
      return Object.keys(this.skills).map(key => this.skills[key])
    },
    skillInfo () {
      const skillProfienciesByGroup = this.groupSkillProfilesBySkill(this.skillList)
      Object.keys(skillProfienciesByGroup).forEach((skillId) => {
        const skill = skillProfienciesByGroup[skillId]
        skill.proficiencyAverage = this.calculateAverage(skill.proficiencies)
        skill.willingnessAverage = this.calculateAverage(skill.willingness)
      })
      return skillProfienciesByGroup
    }
  },
  methods: {
    calculateAverage (arr) {
      if (arr && arr.length > 0) {
        return Math.round((arr.reduce((accumulate, currentVal) => accumulate + currentVal) / arr.length) * 100) / 100
      }
      return 0
    },
    createEmptySkillObject (skills) {
      const skillProfiencyBySkillId = {
      }
      skills.forEach((skill) => {
        skillProfiencyBySkillId[skill.id] = {
          name: skill.name,
          proficiencies: [],
          willingness: []
        }
      })
      return skillProfiencyBySkillId
    },
    groupSkillProfilesBySkill (skills) {
      const skillObject = this.createEmptySkillObject(skills)
      this.skillProfiles.forEach((skillProfile) => {
        skillObject[skillProfile.skillId].proficiencies.push(skillProfile.knows)
        skillObject[skillProfile.skillId].willingness.push(skillProfile.wantsTo)
      })
      return skillObject
    }
  }
}
</script>

<style scoped>
#spinner-container {
  text-align: center;
}
.card-box {
  border:1px solid black
}
.fa {
  font-size: 24px;
  color: grey;
}
</style>
