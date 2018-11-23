<template>
  <div>
    <h1 class="text-primary">
      <slot name="header" />
    </h1>
    <loading v-if="!appInitialized" />
    <div v-else>
      <div v-if="skillList.length === 0 || skillProfiles.length === 0">
        <span id="no-data-message">Sorry there is no data to display :(</span>
      </div>
      <div v-else>
        <b-row class="no-gutters mt-1">
          <b-col
            :cols="12"
            :md="6"
          >
            <top-skill-chart
              :skill-info="skillInfo"
            />
          </b-col>
          <b-col
            :cols="12"
            :md="6"
          >
            <most-willingness-chart
              :skill-info="skillInfo"
            />
          </b-col>
        </b-row>
        <b-row class="no-gutters mt-1">
          <b-col
            :cols="12"
            :md="12"
          >
            <skill-chart
              v-if="appInitialized"
              :md-size="12"
              :skills="skills"
              :skill-info="skillInfo"
              :profile-list="profileList"
              class="pb-1"
            />
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SkillChart from './SkillChart'
import TopSkillChart from './TopSkillChart'
import MostWillingnessChart from './MostWillingnessChart'

const calculateAverage = (arr) => {
  if (arr && arr.length > 0) {
    return Math.round((arr.reduce((accumulate, currentVal) => accumulate + currentVal) / arr.length) * 100) / 100
  }
  return 0
}

export default {
  components: {
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
        skill.proficiencyAverage = calculateAverage(skill.proficiencies)
        skill.willingnessAverage = calculateAverage(skill.willingness)
      })
      return skillProfienciesByGroup
    }
  },
  methods: {
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
