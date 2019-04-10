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
    <b-row>
      <b-col>
        <b-textarea
          v-model="otherInfoAsMarkdown"
          rows="15"
          placeholder="## Education"
          @input="updateMarkdown"
        />
      </b-col>
      <b-col>
        <div v-html="compiledMarkdown" />
      </b-col>
    </b-row>
  </b-card>
</template>
<script>

import _ from 'lodash'
import marked from 'marked'

export default {
  name: 'CvToolOtherInfo',
  props: {
    'profile': Object
  },
  data () {
    return {
      otherInfoAsMarkdown: ''
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.otherInfoAsMarkdown, { sanitize: true })
    }
  },
  created: function () {
    this.otherInfoAsMarkdown = this.profile.otherInfo ? this.profile.otherInfo : ''
    this.$emit('update-markdown', this.otherInfoAsMarkdown)
  },
  methods: {
    updateMarkdown: function () {
      _.debounce(function (e) {
        this.otherInfoAsMarkdown = e.target.value
      }, 300)
      this.$emit('update-markdown', this.otherInfoAsMarkdown)
    }
  }
}
</script>
