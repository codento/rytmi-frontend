<template>
  <div class="animated fadeIn">
    <b-col class="col-md-3" style="float:left">
      <b-card id="search">
        <h2>Search</h2>
        <p>(Filters by name)</p>
        <input v-model="param"></input>
        <div id="active">
          <ul>
            <li v-for='skill in active' class="active">
              <a class="remove" @click="removeFromSearch(skill)">&times;</a> {{skill.name}}
            </li>
          </ul>
        </div>
        <div>
          <b-dropdown id="ddown1" text="Add skills to search:" class="m-md-2">
            <b-dropdown-item-button v-for="skill in dropdown" :key="skill.id" @click="addToSearch(skill)">
              {{skill.name}}
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
      </b-card>
    </b-col>
    <b-col class="col-md-9" style="float:right">
      <Results :param='param' :active='active'></Results>
    </b-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Results from '../components/Search/Results'

export default {
  name: 'Search',
  data () {
    return {
      param: '',
      active: [],
      dropdown: [],
      lockDropdown: false
    }
  },
  computed: {
    ...mapGetters([
      'skills'
    ])
  },
  watch: {
    skills: function () {
      console.log('watch')
      if (!this.lockDropdown) {
        this.dropdown = Object.assign({}, this.skills)
      }
    }
  },
  methods: {
    addToSearch: function (skill) {
      this.lockDropdown = true
      this.active.push(skill)
      delete this.dropdown[skill.id]
    },
    removeFromSearch: function (skill) {
      this.dropdown[skill.id] = skill
      this.active = this.active.filter(el => (el.id !== skill.id))
    }
  },
  components: {
    Results
  }
}
</script>

<style scoped>
input {
  width: 100%;
}
ul {
  list-style-type: none;
}
.active {
  display: inline-block;
  border-radius: 10px;
  padding: .5vw;
  margin: .1vw;
  background-color: orange;
}
#active {
  margin-top: 1vw;
}
#active ul {
  padding: 0;
}
.remove {
  cursor: pointer;
}
img {
  object-fit: contain;
  margin-left: 10px
}
</style>
