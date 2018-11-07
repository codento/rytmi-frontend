<template>
  <div class="animated fadeIn">
    <h2>Profiles</h2>
    <b-row id="search">
      <b-col>
        <b-row class="search-item">
          <b-col>
            <b-form-input
              v-model="filterName"
              type="text"
              placeholder="Filter by name" />
          </b-col>
        </b-row>
        <b-row class="search-item">
          <b-col>
            <b-dropdown
              text="Add skill filters:">
              <b-dropdown-item-button
                v-for="skill in selectableSkills"
                :key="skill.id"
                @click="addToSearch(skill)">
                {{ skill.name }}
              </b-dropdown-item-button>
            </b-dropdown>
            <ul>
              <li
                v-for="skill in filterSkills"
                :key="skill.name"
                class="skillFilter"
                @click="removeFromSearch(skill)">
                &times; {{ skill.name }}
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <Results
      :filterName="filterName"
      :filterSkills="filterSkills" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Results } from '../components/Search'
import _ from 'lodash'

export default {
  name: 'Search',
  components: {
    Results
  },
  data () {
    return {
      filterName: '',
      filterSkills: []
    }
  },
  computed: {
    ...mapGetters([
      'skills'
    ]),
    selectableSkills () {
      const currentSkills = this.filterSkills.map(skill => skill.id)
      return _.filter(this.skills, skill => !currentSkills.includes(skill.id))
    }
  },
  mounted () {
    document.title = 'Rytmi - Search'
  },
  methods: {
    addToSearch: function (skill) {
      const skills = this.filterSkills.slice(0)
      skills.push(skill)
      this.filterSkills = skills
    },
    removeFromSearch: function (skill) {
      this.filterSkills = this.filterSkills.filter(el => (el.id !== skill.id))
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
</style>
