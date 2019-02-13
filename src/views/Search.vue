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
            <small>Add skill filters:</small>
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
            <Datepicker name="testi" />
            <input
              id="utilization-filter-date"
              v-model="utilizationDateFilter"
              data-date-format="d/m/yyyy"
              date-format="d/m/yyyy"
              class="form-control"
              type="date"
              lang="fi"
            />
          </b-col>
          <b-col class="col-sm-9">
            <b-button
              variant="primary"
              class="position-bottom"
              @click="clearUtilizationDateFilter"
            >Clear date</b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <Results
      :name-filter="nameFilter"
      :skill-filters="mapSkillFilterForResultsComponent"
      :utilization-date-filter="utilizationDateFilter"
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
      utilizationDateFilter: '',
      selectedSkills: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillName'
    ]),
    selectFilterOptions () {
      const skills = Object.values(this.skills).map(skill => ({ label: skill.name, id: skill.id }))
      const unselectedSkills = skills.filter(selectableSkill => !(this.selectedSkills.map(skill => skill.id)).includes(selectableSkill.id))
      return sortBy(unselectedSkills, ['label'])
    },
    mapSkillFilterForResultsComponent () {
      return this.selectedSkills.map(skill => ({ name: skill.label, id: skill.id }))
    }
  },
  mounted () {
    document.title = 'Rytmi - Search'
  },
  methods: {
    clearUtilizationDateFilter () {
      this.utilizationDateFilter = ''
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
