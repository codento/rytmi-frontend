<template>
  <b-container
    fluid
    class="footer"
  >
    <b-row>
      <b-col class="text-center my-auto">
        <span>Rytmiapp &copy; 2019 <a href="https://codento.com">Codento Oy</a></span>
      </b-col>
      <b-col class="text-center">
        <span
          v-b-modal="'developer-info'"
        >
          {{ `Frontend: ${frontendVersion}` }}
          <br>
          {{ `Api:  ${backendVersion}` }}
        </span>
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
            <div>Token is valid: {{ tokenValidTimeString() }}</div>
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
        </b-col>

    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { version as frontendVersion } from '../../../package'
import { getVersion } from '@/utils/api/api'
import { format } from 'date-fns'

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
    },
    tokenValidTimeString () {
      return format(new Date(this.tokenValidTime * 1000), 'DD.MM.YYYY HH:mm:ss')
    }
  }
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.footer {
  color: #FFF;
  padding: 15px;
}
</style>
