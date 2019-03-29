<template>
  <b-container class="animated fadeIn profile">
    <b-row>
      <b-tabs content-class="mt-3">
        <b-tab
          no-body
          title="Profile"
        >
          <UserProfile
            :profile="profile"
          />
        </b-tab>
        <b-tab title="CV tool">
          <CvTool
            :profile="profile"
          />
        </b-tab>
        <!--<h3>-->
        <!--{{ showCvTool ? "Show cv tool" : "Show profile" }}-->
        <!--<span @click="showCvTool = !showCvTool">-->
        <!--<i-->
        <!--:class="showCvTool ? 'fa-chevron-down' : 'fa-chevron-up'"-->
        <!--class="fa"-->
        <!--/>-->
        <!--</span>-->
        <!--</h3>-->
      </b-tabs>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../store'
import {
  CvTool,
  UserProfile
} from '../components/Profile'

export default {
  name: 'Profile',
  components: {
    CvTool,
    UserProfile
  },
  data () {
    return {
      showCvTool: false
    }
  },
  computed: {
    ...mapGetters(['profileById']),
    profile () {
      return this.profileById(this.$route.params.id)
    }
  },
  watch: {
    profile: function (val, oldVal) {
      if (val) {
        document.title = `Rytmi - ${val.firstName} ${val.lastName}`
      }
    }
  },
  methods: {
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchPPsOfProfile', to.params.id)
    next()
  }
}
</script>
