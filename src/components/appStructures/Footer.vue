<template>
  <TheFooter>
    <span>Rytmiapp &copy; 2019 <a href="https://codento.com">Codento Oy</a></span>
    <div
      v-b-modal="'developer-info'"
      class="ml-auto"
    >
      {{ `Frontend: ${frontendVersion}` }}
      <br>
      {{ `Api:  ${backendVersion}` }}
    </div>
    <b-modal
      id="developer-info"
      ok-only
      ok-title="Close"
      ok-variant="light"
    >
      <b-row>
        <div>User token: {{ !!isAuthenticated }}</div>
      </b-row>
      <b-row>
        <div>Token is valid: {{ isTokenValid }} until {{ new Date(tokenValidTime * 1000) }} seconds</div>
      </b-row>
      <b-button @click="expireToken">
        Expire token
      </b-button>
      <template
        slot="modal-header"
      >
        <h4 class="modal-header-text">
          Developer info
        </h4>
      </template>
    </b-modal>
  </TheFooter>
</template>

<script>
import { mapGetters } from 'vuex'
import { Footer as TheFooter } from '@coreui/vue'
import { version as frontendVersion } from '../../../package'
import { getVersion } from '@/utils/api/api'

export default {
  name: 'CFooter',
  components: {
    TheFooter
  },
  data () {
    return {
      backendVersion: '',
      frontendVersion: frontendVersion
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isTokenValid', 'tokenValidTime'])
  },
  created: function () {
    this.getBackendVersion()
  },
  methods: {
    async getBackendVersion () {
      const response = await getVersion()
      this.backendVersion = response.data.version
    },
    expireToken () {
      this.$store.commit('auth/SET_TOKEN_EXPIRATION', null)
    }
  }
}
</script>
