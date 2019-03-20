<template>
  <TheFooter>
    <span>Rytmiapp &copy; 2018 <a href="https://codento.com">Codento Oy</a></span>
    <div class="ml-auto">
      {{ `Frontend: ${frontendVersion}` }}
      <br>
      {{ `Api:  ${backendVersion}` }}
    </div>
  </TheFooter>
</template>

<script>
import { Footer as TheFooter } from '@coreui/vue'
import { version as frontendVersion } from '../../../package'
import { getVersion } from '../../utils/api'

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
  created: function () {
    this.getBackendVersion()
  },
  methods: {
    async getBackendVersion () {
      const response = await getVersion()
      this.backendVersion = response.data.version
    }
  }
}
</script>
