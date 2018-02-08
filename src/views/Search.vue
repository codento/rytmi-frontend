<template>
  <div class="animated fadeIn">
    <b-col class="col-sm-3" style="float:left">
      <b-card id="search">
        <h2>Search</h2>
        <p>(Filters by name)</p>
        <input v-model="param"></input>
      </b-card>
    </b-col>
    <b-col class="col-sm-9" style="float:right">
      <Results :profiles='profileFilter(param)'></Results>
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
      param: ''
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'profileById',
      'profileFilter',
      'skills'
    ])
  },
  components: {
    Results
  },
  created () {
    this.$store.dispatch('fetchProfiles')
    this.$store.dispatch('fetchSkills')
  },
  methods: {
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
}
img {
  object-fit: contain;
  margin-left: 10px
}
#search {
  position: fixed;
  width: 20%;
}
</style>
