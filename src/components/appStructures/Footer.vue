<template>
  <b-container>
    <b-row>
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
          <div>Token is valid: {{ isTokenValid }} until {{ new Date(tokenValidTime * 1000) }}</div>
        </b-row>
        <b-button @click="expireToken">
          Set token to expire in 30 seconds
        </b-button>
        <template
          slot="modal-header"
        >
          <h4 class="modal-header-text">
            Developer info
          </h4>
        </template>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { version as frontendVersion } from '../../../package'
import { getVersion } from '@/utils/api/api'

export default {
  name: 'CFooter',
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
      this.$store.commit('auth/SET_TOKEN_EXPIRATION', Date.now() / 1000 + 30)
    }
  }
}
</script>
