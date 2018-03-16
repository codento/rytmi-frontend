<template>
  <div class="animated fadeIn">
    <b-col class="col-md-3" style="float:left">
      <b-card id="search">
        <h2>Search</h2>
        <p>(Filters by name)</p>
        <input v-model="param"></input>
        <b-form-group label='Search by:'>
          <b-form-radio-group id="btnradios" buttons v-model='selected' :options='options' name='radioBtnStacked' />
        </b-form-group>
        <div id="active">
          <ul>
            <li v-for='skill in active' class="active" :key="skill.name">
              <a class="remove" @click="removeFromSearch(skill)">&times;</a> {{skill.name}}
            </li>
          </ul>
        </div>
        <div>
          <b-dropdown id="ddown1" text="Add skills to search:" class="m-md-2">
            <b-dropdown-item-button v-for="skill in skillsNotIn(active)" :key="skill.id" @click="addToSearch(skill)">
              {{skill.name}}
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
      </b-card>
    </b-col>
    <b-col class="col-md-9" style="float:right">
      <Results :param='param' :selected='selected ' :active='active'></Results>
    </b-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Results } from '../components/Search'

export default {
  name: 'Search',
  data () {
    return {
      param: '',
      selected: 'knows',
      options: [
        { text: 'Skills', value: 'knows' },
        { text: 'Willingness', value: 'wantsTo' }
      ],
      active: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillsNotIn'
    ])
  },
  methods: {
    addToSearch: function (skill) {
      this.active.push(skill)
    },
    removeFromSearch: function (skill) {
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
