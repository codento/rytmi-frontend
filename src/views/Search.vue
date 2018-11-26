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
              placeholder="Filter by name" />
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-sm-3">
            <small>Add skill filters:</small>
            <v-select
              multiple
              v-model="selectedFilteringSkills"
              :options="mapSkillsForSkillFilter"
            >
            </v-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="col-sm-3">
            <small>Not utilized on</small>
            <b-input
              id="utilization-filter-date"
              v-model="utilizationDateFilter"
              class="form-control"
              type="date"
            />
          </b-col>
          <b-col class="col-sm-9">
            <b-button
              variant="primary"
              class="position-bottom"
              @click="clearUtilizationDateFilter">Clear date</b-button>
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
import { mapGetters } from 'vuex'
import { Results } from '../components/Search'
import { sortBy } from 'lodash'
import vSelect from "vue-select"

export default {
  name: 'Search',
  components: {
    Results,
    vSelect
  },
  data () {
    return {
      nameFilter: '',
      utilizationDateFilter: '',
      selectedFilteringSkills: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillName'
    ]),
    mapSkillsForSkillFilter () {
      const skills = Object.values(this.skills).map(skill => ({ label: skill.name, id: skill.id }))
      sortBy(skills, ['label'])
      return skills
    },
    mapSkillFilterForResultsComponent () {
      return this.selectedFilteringSkills.map(skill => ({ name: skill.label, id: skill.id }))
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
  min-height: 15em;
}
ul {
  list-style-type: none;
}
.skillFilter {
  display: inline-block;
  border-radius: 10px;
  padding: .5vw;
  margin: .1vw;
  background-color: orange;
  cursor: pointer;
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
