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
          placeholder="Use Markdown"
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
    // TODO
    this.otherInfoAsMarkdown = this.profile.description || '## Education\nHogwards\n## Hobbies\nQuiddish'
    this.$emit('updateMarkdown', this.otherInfoAsMarkdown)
  },
  methods: {
    updateMarkdown: function () {
      _.debounce(function (e) {
        this.otherInfoAsMarkdown = e.target.value
      }, 300)
      this.$emit('updateMarkdown', this.otherInfoAsMarkdown)
    }
  }
}
</script>
