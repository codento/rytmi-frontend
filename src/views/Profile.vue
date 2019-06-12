<template>
  <b-container class="animated fadeIn profile mt-2">
    <loading v-if="!profile" />
    <b-row v-else>
      <b-col cols="12">
        <b-btn
          v-if="false"
          v-b-modal.cv-tool-modal
          type="button"
          class="open-cv-tool-button pull-right"
        >
          Open CV tool
        </b-btn>
      </b-col>
      <b-col cols="12">
        <UserProfile
          :profile="profile"
        />
        <CvTool
          :profile="profile"
        />
      </b-col>
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
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchPPsOfProfile', to.params.id)
    next()
  }
}
</script>

<style scoped>
.open-cv-tool-button {
  margin-bottom: 8px;
}
</style>
