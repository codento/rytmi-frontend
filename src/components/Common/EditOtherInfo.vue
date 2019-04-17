<template>
  <b-row class="mt-2">
    <b-col>
      <b-tabs content-class="mt-1 border-0">
        <b-tab
          active
          title="Edit"
        >
          <label
            v-if="inputLabel.length > 0"
            for="input-other-info"
          >
            {{ inputLabel }}
          </label>
          <b-textarea
            id="input-other-info"
            v-model="otherInfoAsMarkdown"
            :rows="rows"
            :placeholder="placeholderText"
            :state="isValidMarkdown"
            @input="updateMarkdown"
          />
          <b-form-invalid-feedback
            id="input-other-info-feedback"
            class="text-left"
          >
            {{ errorMessage }}
          </b-form-invalid-feedback>
        </b-tab>
        <b-tab
          title="Template"
        >
          <b-textarea
            :rows="rows"
            :value="placeholderText"
            plaintext
          />
        </b-tab>
      </b-tabs>
    </b-col>
    <b-col>
      <div v-html="compiledMarkdown" />
    </b-col>
  </b-row>
</template>
<script>
import _ from 'lodash'
import marked from 'marked'

export default {
  name: 'EditOtherInfo',
  props: {
    languageKey: String,
    inputText: String,
    inputLabel: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      otherInfoAsMarkdown: '',
      placeHolders: {
        'fi': '## Koulutus\n#### Esimerkkioppilaitos, 2012\nJoku tutkinto, pääaine (sivuaine)',
        'en': '## Education\n#### Example university, 2012\nSome degree, major (minor)'
      },
      requiredItems: {
        'fi': [{ requiredItem: '## Koulutus', errorMessage: 'Education information missing, can\'t find markdown element ## Koulutus.' }],
        'en': [{ requiredItem: '## Education', errorMessage: 'Education information missing, can\'t find markdown element ## Education.' }]
      }
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.otherInfoAsMarkdown, { sanitize: true })
    },
    placeholderText: function () {
      return this.placeHolders[this.languageKey]
    },
    isValidMarkdown: function () {
      return this.requiredItems[this.languageKey].every(a => this.otherInfoAsMarkdown.includes(a.requiredItem))
    },
    errorMessage: function () {
      const missingItems = this.requiredItems[this.languageKey].filter(a => !this.otherInfoAsMarkdown.includes(a.requiredItem))
      return missingItems.map(item => item.errorMessage).join(' ')
    }
  },
  mounted: function () {
    this.otherInfoAsMarkdown = this.inputText
  },
  methods: {
    updateMarkdown: function () {
      _.debounce(function (e) {
        this.otherInfoAsMarkdown = e.target.value
      }, 300)
      this.$emit('input-updated', this.otherInfoAsMarkdown, this.languageKey)
    }
  }
}
</script>
