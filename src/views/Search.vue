<template>
  <b-container
    class="mt-2"
  >
    <h1>Profiles</h1>
    <b-row id="search">
      <b-col>
        <b-row class="search-item">
          <b-col class="col-sm-3">
            <b-form-input
              v-model="nameFilter"
              type="text"
              placeholder="Filter by name"
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-sm-3">
            <small>Employee role</small>
            <v-select
              v-model="selectedRole"
              :options="employeeRoleList"
              multiple
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-sm-3">
            <small>Add skill filters</small>
            <v-select
              v-model="selectedSkills"
              :options="selectFilterOptions"
              multiple
            />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-sm-3">
            <small>Available on</small>
            <Datepicker
              v-model="utilizationDateFilter"
              name="utilization-date-filter"
            />
          </b-col>
          <b-col class="col-sm-9">
            <b-button
              variant="secondary"
              class="position-bottom"
              @click="clearUtilizationDateFilter"
            >
              Clear date
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <Results
      :name-filter="nameFilter"
      :skill-filters="mapSkillFilterForResultsComponent"
      :utilization-date-filter="utilizationDateFilter"
      :employee-role-filter="selectedRole"
    />
  </b-container>
</template>

<script>
import Datepicker from '../components/helpers/Datepicker'
import { mapGetters, mapActions } from 'vuex'
import { Results } from '../components/Search'
import { orderBy } from 'lodash'
import vSelect from 'vue-select'
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'Search',
  components: {
    Results,
    vSelect,
    Datepicker
  },
  data () {
    return {
      nameFilter: '',
      utilizationDateFilter: new Date(),
      selectedSkills: [],
      selectedRole: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillGroupBySkillId',
      'skillName',
      'skillFilter',
      'profiles',
      'employeeRoles',
      'currentLanguage'
    ]),
    skillsOnly () {
      return Object.values(this.skills)
        .filter(skill => {
          const skillGroup = this.skillGroupBySkillId(skill.id)
          return skillGroup ? skillGroup.title.en !== LANGUAGE_ENUM.LANGUAGE_GROUP_NAME : true
        })
    },
    selectFilterOptions () {
      const skills = this.skillsOnly.map(skill => ({ label: skill.name[this.currentLanguage], id: skill.id }))
      const unselectedSkills = skills.filter(selectableSkill => !(this.selectedSkills.map(skill => skill.id)).includes(selectableSkill.id))
      return orderBy(unselectedSkills, [skill => skill.label.toLowerCase()], ['asc'])
    },
    mapSkillFilterForResultsComponent () {
      return this.selectedSkills.map(skill => ({ name: skill.label, id: skill.id }))
    },
    employeeRoleList () {
      const roles = Object.values(this.employeeRoles).map(role => ({ label: role.title, id: role.id }))
      return roles.filter(selectableRole => !(this.selectedRole.map(role => role.id)).includes(selectableRole.id))
    }
  },
  watch: {
    selectedSkills: function () {
      this.updateSkillFilter(this.selectedSkills)
    }
  },
  created () {
    this.selectedSkills = this.skillFilter ? this.skillFilter : []
    this.selectedRole = this.employeeRoleList.filter(role => role.label !== 'administrative')
  },
  mounted () {
    document.title = 'Rytmi - Profiles'
  },
  methods: {
    ...mapActions(['updateSkillFilter']),
    clearUtilizationDateFilter () {
      this.utilizationDateFilter = undefined
    }
  }
}
</script>

<style scoped>
#search {
    padding: 1em;
    min-height: 10em;
}
.search-item {
  width: 100%;
  padding: 0.5em 0;
}
.position-bottom {
  position: absolute;
  bottom: 0;
}
</style>
