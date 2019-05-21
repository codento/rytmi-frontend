<template>
  <div>
    <h3>Edit education data (step {{ currentStep + 1 }} of {{ steps.length }})</h3>
    <hr>
    <b-row class="my-3">
      <b-col
        v-for="step in Array(steps.length).keys()"
        :key="step"
      >
        <div
          :class="step === currentStep ? 'step-title current-step' : 'step-title text-muted'"
        >
          <i
            v-if="step < currentStep"
            class="fa fa-check"
          />
          <span v-else>
            {{ step + 1 }}
          </span>
          <span> {{ steps[step].stepTitle }} </span>
        </div>
      </b-col>
    </b-row>
    <hr>
    <div v-if="steps[currentStep].useFormTemplate">
      <b-row
        v-for="item in formData.filter(item => item.key !== 'startYear' && item.key !== 'endYear')"
        :key="kebabCase(item.key)"
      >
        <b-col cols="12">
          <small :for="'input-'+ kebabCase(item.key) + '-' + currentLanguage">{{ item.label }}</small>
          <b-form-group
            :id="'edit-'+ kebabCase(item.key) + '-' + currentLanguage"
            :description="item.descriptions[currentLanguage]"
            :invalid-feedback="invalidFeedback(item.key, currentLanguage)"
          >
            <b-form-input
              :id="'input-'+ kebabCase(item.key) + '-' + currentLanguage"
              v-model="editedValues[currentLanguage][item.key]"
              type="text"
              :required="item.key in requiredValues"
              :state="inputState[item.key] ? inputState[item.key].state[currentLanguage] : null"
              class="form-control"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <!-- Starting / finishing years are edited on first step only -->
      <b-row v-if="currentStep === 0">
        <b-col
          v-for="key in ['startYear', 'endYear']"
          :key="key"
          cols="6"
        >
          <small :for="'input-'+ kebabCase(key)">{{ formData.find(item => item.key === key).label }}</small>
          <b-form-group
            :id="'edit-' + kebabCase(key)"
            :invalid-feedback="invalidFeedback(key)"
          >
            <b-input
              :id="'input-' + kebabCase(key)"
              v-model="editedValues[key]"
              type="number"
              :min="1950"
              :max="new Date().getFullYear()"
              :description="formData.find(item => item.key === key).descriptions[currentLanguage]"
              :state="editedValues[key] ? inputState[key].state : null"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <b-card-group
        v-for="langKey in Object.keys(usedLanguages)"
        :key="'preview-in-' + langKey"
        deck
      >
        <b-card
          class="my-2 education-preview"
          no-header
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
    </div>
    <b-btn
      id="save"
      class="pull-right"
      variant="success"
      :disabled="!canContinue"
      @click="handleNextButton()"
    >
      {{ currentStep === steps.length - 1 ? 'Save' : 'Next' }}
    </b-btn>
    <b-btn
      id="cancel"
      variant="danger"
      class="pull-right"
      @click="handleBackButton()"
    >
      {{ currentStep === 0 ? 'Cancel' : 'Back' }}
    </b-btn>
  </div>
</template>

<script>
import { kebabCase, cloneDeep } from 'lodash'

export default {
  name: 'CvInfoEditEducationForm',
  props: {
    initialValues: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      editedValues: cloneDeep(this.initialValues),
      requiredValues: ['school'],
      currentStep: 0,
      usedLanguages: {
        fi: { label: 'Suomeksi' },
        en: { label: 'in English' }
      },
      formData: [
        { key: 'school',
          label: 'Place of education',
          descriptions: {
            fi: 'Oppilaitoksen nimi, esim. Aalto-yliopisto',
            en: 'Name of the shool or institution, e.g. Aalto University'
          }
        },
        { key: 'degree',
          label: 'Degree',
          descriptions: {
            fi: 'Tutkinnon nimi, esim. Tietotekniikan diplomi-insinööri',
            en: 'e.g. M.Sc. (tech) in Computer Science'
          }
        },
        { key: 'major',
          label: 'Major',
          descriptions: {
            fi: 'Pääaineen/suuntautumisen nimi, esim. Ohjelmistotekniikka',
            en: 'Name of the major/study track, e.g Computer Science'
          }
        },
        { key: 'minor',
          label: 'Minor',
          descriptions: {
            fi: 'Sivuaineen nimi, esim. Geoinformatiikka',
            en: 'Name of the minor studied, e.g. Geoinformatics'
          }
        },
        { key: 'startYear', label: 'Starting year', descriptions: { fi: 'Aloitusvuosi', en: '' } },
        { key: 'endYear', label: 'Finishing year', descriptions: { fi: 'Lopetusvupsi', en: '' } }

      ],
      steps: [
        { languageKey: 'fi', useFormTemplate: true, stepTitle: 'Fill data in Finnish' },
        { languageKey: 'en', useFormTemplate: true, stepTitle: 'Fill data in English' },
        { useFormTemplate: false, stepTitle: 'Review and submit' }
      ]
    }
  },
  computed: {
    currentLanguage () {
      return this.steps[this.currentStep].languageKey
    },
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
    },
    canContinue () {
      if (this.currentStep < this.steps.length) {
        return this.formIsValidByLanguage(this.steps[this.currentStep].languageKey)
      } else {
        return Object.keys(this.usedLanguages).every(key => this.formIsValidByLanguage(key))
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
    handleNextButton () {
      if (this.currentStep < this.steps.length - 1) {
        ++this.currentStep
      } else {
        this.$emit('submit', this.editedValues)
      }
    },
    handleBackButton () {
      if (this.currentStep > 0) {
        --this.currentStep
      } else {
        this.editedValues = Object.assign({}, this.initialValues)
        this.$emit('cancel')
      }
    }
  }
}
</script>

<style scoped >
.step-title {
  font-weight: 500;
  font-size: 15px;
  text-transform: uppercase;
}

.step-title.current-step {
  font-weight: bolder;
}

.education-preview > h4 {
  font-weight: bolder;
}

</style>
