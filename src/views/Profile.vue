<template>
  <b-container class="animated fadeIn profile mt-2">
    <b-row>
      <b-tabs content-class="mt-3 border-0">
        <b-tab
          no-body
          title="Profile"
        >
          <loading v-if="!profile" />
          <UserProfile
            v-else
            :profile="profile"
          />
        </b-tab>
        <b-tab
          no-body
          title="CV tool"
        >
          <loading v-if="!profile" />
          <CvTool
            v-else
            :profile="profile"
          />
        </b-tab>
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
