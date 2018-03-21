<template>
  <div class="animated fadeIn">
    <b-col class="col-md-13">
      <div class="search-bar" id="search">
        <h2>Find people</h2>
        <input class="form-control" placeholder="Filter by name" v-model="param" />
        <div class="search-tag-container" id="active">
          <ul>
            <li @click="removeFromSearch(skill)" v-for='skill in active' class="active remove" :key="skill.name">
              <a class="remove" >&times;</a> {{skill.name}}
            </li>
          </ul>
        </div>
        <div class="search-tag-dropdown">
          <b-dropdown id="ddown1" text="Add skill filters:" class="m-md-2">
            <b-dropdown-item-button v-for="skill in skillsNotIn(active)" :key="skill.id" @click="addToSearch(skill)">
              {{skill.name}}
            </b-dropdown-item-button>
          </b-dropdown>
        </div>
        <div class="search-bar-sort">
          <span>Sort:</span>
          <b-form-radio-group id="btnradios" buttons v-model='selected' :options='options' name='radioBtnStacked' />
        </div>
      </div>
    </b-col>
    <b-col class="col-md-12" style="float:right">
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
