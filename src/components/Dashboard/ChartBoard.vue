<template>
  <div>
    <b-row>
      <b-col
        :cols="6"
      >
        <h1 class="text-primary">
          <slot name="header" />
        </h1>
      </b-col>
      <b-col
        :cols="6"
      >
        <v-select
          v-model="selectedEmployeeRoles"
          :options="employeeRoleOptions"
          label="title"
          multiple
        />
      </b-col>
    </b-row>
    <div>
      <div v-if="skillsOnlyList.length === 0 || skillProfiles.length === 0">
        <span id="no-data-message">Sorry there is no data to display :(</span>
      </div>
      <div v-else>
        <b-row class="no-gutters mt-1">
          <b-col
            cols="12"
            class="mb-2"
          >
            <consultant-utilization-list />
          </b-col>
          <b-col
            :cols="12"
            :md="8"
          >
            <ConsultantUtilizationChart
              :active-role-selection="selectedEmployeeRoles"
            />
          </b-col>
          <b-col
            :cols="12"
            :md="4"
          >
            <b-row class="ml-md-1">
              <b-col
                :cols="12"
              >
                <TopSkillChart
                  :skill-info="skillInfo"
                />
              </b-col>
              <b-col
                :cols="12"
                class="mt-2"
              >
                <MostWillingnessChart
                  :skill-info="skillInfo"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row class="no-gutters mt-1">
          <b-col
            :cols="12"
            :md="12"
          >
            <SkillChart
              v-if="appInitialized"
              :md-size="12"
              :skills="skillsOnly"
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
import _ from 'lodash'
import vSelect from 'vue-select'
import LANGUAGE_ENUM from '@/utils/constants'
import SkillChart from './SkillChart'
import TopSkillChart from './TopSkillChart'
import MostWillingnessChart from './MostWillingnessChart'
import ConsultantUtilizationChart from './ConsultantUtilizationChart'
import ConsultantUtilizationList from './ConsultantUtilizationList'

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
    MostWillingnessChart,
    ConsultantUtilizationChart,
    ConsultantUtilizationList,
    vSelect
  },
  data () {
    return {
      selectedEmployeeRoles: []
    }
  },
  computed: {
    ...mapGetters([
      'appInitialized',
      'skills',
      'skillProfiles',
      'skillGroupBySkillId',
      'profileList',
      'employeeRoles',
      'profileById'
    ]),
    skillsOnlyList () {
      const filteredSkillKeys = Object.keys(this.skills).filter(skillId => {
        const skillGroup = this.skillGroupBySkillId(skillId)
        return skillGroup ? skillGroup.title !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME : false
      })
      return filteredSkillKeys.map(key => this.skills[key])
    },
    skillsOnly () {
      return _.keyBy(this.skillsOnlyList, 'id')
    },
    skillInfo () {
      const skillProfienciesByGroup = this.groupSkillProfilesBySkill()
      Object.keys(skillProfienciesByGroup).forEach((skillId) => {
        const skill = skillProfienciesByGroup[skillId]
        skill.proficiencyAverage = calculateAverage(skill.proficiencies)
        skill.willingnessAverage = calculateAverage(skill.willingness)
      })
      return skillProfienciesByGroup
    },
    employeeRoleOptions () {
      const allEmployeeRoleOptions = Object.values(this.employeeRoles).filter(role => {
        return role.title !== 'administrative'
      })
      return allEmployeeRoleOptions.filter(option => !(this.selectedEmployeeRoles.map(role => role.id)).includes(option.id))
    }
  },
  mounted () {
    this.selectedEmployeeRoles = this.employeeRoleOptions
  },
  methods: {
    createEmptySkillObject () {
      const skillProfiencyBySkillId = {}
      this.skillsOnlyList.forEach((skill) => {
        skillProfiencyBySkillId[skill.id] = {
          name: skill.name,
          proficiencies: [],
          willingness: []
        }
      })
      return skillProfiencyBySkillId
    },
    groupSkillProfilesBySkill () {
      const skillObject = this.createEmptySkillObject()
      const filteredSkillProfiles = this.skillProfiles.filter(profileSkill => {
        return profileSkill ? Object.keys(this.skillsOnly).includes(profileSkill.skillId.toString()) : false
      })
      filteredSkillProfiles.forEach(skillProfile => {
        if (this.selectedEmployeeRoles.some(role => { return this.profileById(skillProfile.profileId).employeeRoles.includes(role.id) })) {
          skillObject[skillProfile.skillId].proficiencies.push(skillProfile.knows)
          skillObject[skillProfile.skillId].willingness.push(skillProfile.wantsTo)
        }
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
