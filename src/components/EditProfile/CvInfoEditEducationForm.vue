<template>
  <b-tabs content-class="mt-1 border-0">
    <b-tab
      v-for="(langKey, tabIndex) in ['fi', 'en']"
      :key="'tab-' + langKey"
    >
      <template slot="title">
        {{ tabIndex == 0 ? 'In Finnish' : 'In English' }}
        <span>
          <i
            v-if="!formIsValidByLanguage(langKey)"
            class="fa fa-exclamation-circle text-danger"
          />
          <i
            v-else
            class="fa fa-check-circle text-success"
          />
        </span>
      </template>
      <b-row
        v-for="(item, index) in labels.filter(item => item.key !== 'startYear' && item.key !== 'endYear')"
        :key="kebabCase(item.key) + '-' + index"
      >
        <b-col cols="12">
          <b-form-group
            :id="'edit-'+ kebabCase(item.key) + '-' + langKey"
            :label="item.label"
            label-size="sm"
            :label-for="'input-'+ kebabCase(item.key) + '-' + langKey"
            :invalid-feedback="invalidFeedback(item.key, langKey)"
          >
            <b-form-input
              :id="'input-'+ kebabCase(item.key) + '-' + langKey"
              v-model="editedValues[langKey][item.key]"
              type="text"
              :required="item.key in requiredValues"
              :state="inputState[item.key] ? inputState[item.key].state[langKey] : null"
              class="form-control"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-for="key in ['startYear', 'endYear']"
          :key="key"
          cols="6"
        >
          <b-form-group
            :id="'edit-' + kebabCase(key)"
            :label="findLabel(key)"
            label-size="sm"
            :label-for="'input-'+ kebabCase(key)"
            :invalid-feedback="invalidFeedback(key)"
          >
            <b-input
              :id="'input-' + kebabCase(key)"
              v-model="editedValues[key]"
              type="number"
              :min="1950"
              :max="new Date().getFullYear()"
              :state="editedValues[key] ? inputState[key].state : null"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-tab>
    <b-card-group
      v-for="(langKey, cardIndex) in ['fi', 'en']"
      :key="'preview-in-' + langKey"
      deck
    >
      <b-card
        :header="cardIndex == 0 ? 'Preview in Finnish' : 'Preview in English'"
        header-tag="header"
        class="my-2 education-preview"
        no-body
      >
        <b-card-body>
          <b-card-text>
            <h4> {{ editedValues[langKey].school }} <span class="small"> {{ editedValues.startYear }} - {{ editedValues.endYear }}</span></h4>
            <h5 v-if="editedValues[langKey].degree">
              {{ editedValues[langKey].degree }}
            </h5>
            <p>
              <span v-if="editedValues[langKey].major">
                Pääaine: {{ editedValues[langKey].major }}
              </span>
              <br>
              <span v-if="editedValues[langKey].minor">
                Sivuaine: {{ editedValues[langKey].minor }}
              </span>
            </p>
          </b-card-text>
        </b-card-body>
      </b-card>
    </b-card-group>
    <b-btn
      id="save"
      class="pull-right"
      variant="success"
      :disabled="!formIsValidByLanguage('fi') || !formIsValidByLanguage('en')"
      @click.prevent="$emit('submit', editedValues)"
    >
      Save
    </b-btn>
    <b-btn
      id="cancel"
      variant="danger"
      class="pull-right"
      @click="cancelEdits"
    >
      Cancel
    </b-btn>
  </b-tabs>
</template>

<script>
import { kebabCase } from 'lodash'

export default {
  name: 'CvInfoEditEducationForm',
  props: {
    initialValues: {
      type: Object,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      editedValues: Object.assign({}, this.initialValues),
      requiredValues: ['school']
    }
  },
  computed: {
    startYearState () {
      const rules = [
        {
          state: this.editedValues.endYear ? Number(this.editedValues.startYear) <= Number(this.editedValues.endYear) : true,
          feedback: 'Starting year cannot be after finishing year'
        },
        this.isValidYear(this.editedValues.startYear)
      ]
      return {
        state: rules.every(item => item.state),
        feedback: rules.filter(item => !item.state).map(item => item.feedback).join('\n')
      }
    },
    inputState () {
      return {
        school: {
          state: {
            fi: this.editedValues.fi.school.length > 0,
            en: this.editedValues.en.school.length > 0
          },
          feedback: 'Cannot be empty'
        },
        startYear: this.startYearState,
        endYear: this.isValidYear(this.editedValues.endYear)
      }
    }
  },
  watch: {
    initialValues: (val) => {
      this.editedValues = Object.assign({}, val)
    }
  },
  methods: {
    kebabCase (text) {
      return kebabCase(text)
    },
    findLabel (key) {
      return this.labels.find(label => label.key === key).label
    },
    isValidYear (year) {
      return {
        state: year ? Number(year) >= 1940 && Number(year) <= new Date().getFullYear() : true,
        feedback: `Invalid year, should be between 1940-${new Date().getFullYear()}`
      }
    },
    invalidFeedback (key, langKey = null) {
      if (this.inputState[key]) {
        const state = this.inputState[key].state
        // Handle both cases: state.[lang] == true and state == true
        if (state[langKey] || state === true) {
          return ''
        } else {
          return this.inputState[key].feedback
        }
      }
      return ''
    },
    formIsValidByLanguage (langKey) {
      const statesForLanguage = Object.keys(this.inputState).map(key => {
        const item = this.inputState[key]
        if (item.state.hasOwnProperty(langKey)) {
          return item.state[langKey]
        } else {
          return item.state
        }
      })
      return statesForLanguage.every(state => state)
    },
    cancelEdits () {
      this.editedValues = Object.assign({}, this.initialValues)
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped >
.education-preview > h4 {
  font-weight: bolder;
}

</style>
