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
        <b-row class="search-item">
          <b-col>
            <b-dropdown
              text="Add skill filters:"
            >
              <b-dropdown-item-button
                v-for="skill in selectableSkills"
                :key="skill.id"
                @click="addToSearch(skill)"
              >
                {{ skill.name }}
              </b-dropdown-item-button>
            </b-dropdown>
            <ul>
              <li
                v-for="skill in skillFilters"
                :key="skill.name"
                class="skillFilter"
                @click="removeFromSearch(skill)"
              >
                &times; {{ skill.name }}
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <Results
      :name-filter="nameFilter"
      :skill-filters="skillFilters" />
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
      nameFilter: '',
      skillFilters: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillName'
    ]),
    selectableSkills () {
      const currentSkills = this.skillFilters.map(skill => skill.id)
      return _(this.skills)
        .filter(skill => !currentSkills.includes(skill.id))
        .sortBy(skill => this.skillName(skill.id))
        .value()
    }
  },
  mounted () {
    document.title = 'Rytmi - Search'
  },
  methods: {
    addToSearch: function (skill) {
      const skills = this.skillFilters.slice(0)
      skills.push(skill)
      this.skillFilters = skills
    },
    removeFromSearch: function (skill) {
      this.skillFilters = this.skillFilters.filter(el => (el.id !== skill.id))
    }
  }
}
</script>

<style scoped>
#search {
    padding: 1em;
    min-height: 10em;
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
