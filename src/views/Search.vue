<template>
  <div class="animated fadeIn">
    <h2>Profiles</h2>
    <b-row id="search">
      <b-col>
        <b-row class="search-item">
          <b-col>
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
              :options="employeeRoles"
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
            <small>Not utilized on</small>
            <Datepicker
              v-model="utilizationDateFilter"
              name="utilization-date-filter"
            />
          </b-col>
          <b-col class="col-sm-9">
            <b-button
              variant="primary"
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
  </div>
</template>

<script>
import Datepicker from '../components/helpers/Datepicker'
import { mapGetters } from 'vuex'
import { Results } from '../components/Search'
import { sortBy } from 'lodash'
import vSelect from 'vue-select'

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
      utilizationDateFilter: undefined,
      selectedSkills: [],
      selectedRole: undefined
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillName',
      'profiles'
    ]),
    selectFilterOptions () {
      const skills = Object.values(this.skills).map(skill => ({ label: skill.name, id: skill.id }))
      const unselectedSkills = skills.filter(selectableSkill => !(this.selectedSkills.map(skill => skill.id)).includes(selectableSkill.id))
      return sortBy(unselectedSkills, ['label'])
    },
    mapSkillFilterForResultsComponent () {
      return this.selectedSkills.map(skill => ({ name: skill.label, id: skill.id }))
    },
    employeeRoles () {
      const profiles = Object.values(this.profiles)
      const roles = new Set(profiles.map(profile => profile.role))
      return [...roles]
    }
  },
  mounted () {
    document.title = 'Rytmi - Search'
  },
  methods: {
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
