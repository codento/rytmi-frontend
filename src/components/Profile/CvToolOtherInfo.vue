<template>
  <b-card
    id="other-cv-info"
    class="mt-2 mb-2"
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Other information
    </h5>
    <EditOtherInfo
      :input-text="otherInfo"
      :language-key="currentLanguage"
      @input-updated="saveInput"
    />
  </b-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { EditOtherInfo } from '@/components/Common'

export default {
  name: 'CvToolOtherInfo',
  components: {
    EditOtherInfo
  },
  props: {
    profile: Object
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'cvOtherInfo',
      'currentLanguage'
    ]),
    otherInfo: function () {
      if (this.cvOtherInfo.length === 0) {
        return this.profile.otherInfo ? this.profile.otherInfo : ''
      }
      return this.cvOtherInfo
    }
  },
  methods: {
    ...mapActions(['updateCvOtherInfo']),
    saveInput: function (editedInput, language) {
      this.updateCvOtherInfo(editedInput)
    }
  }
}
</script>
