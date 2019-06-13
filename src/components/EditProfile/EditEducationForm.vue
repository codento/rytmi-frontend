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
          <small :for="'input-'+ kebabCase(item.key) + '-' + currentLanguage">{{ item.labels[currentLanguage] }}</small>
          <b-form-group
            :id="'edit-'+ kebabCase(item.key) + '-' + currentLanguage"
            :description="item.descriptions[currentLanguage]"
            :invalid-feedback="invalidFeedback(item.key, currentLanguage)"
          >
            <b-form-input
              :id="'input-'+ kebabCase(item.key) + '-' + currentLanguage"
              v-model="editedValues[currentLanguage][item.key]"
              type="text"
              :state="inputStates[item.key] ? inputStates[item.key][currentLanguage].state : null"
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
          <small :for="'input-'+ kebabCase(key)">{{ formData.find(item => item.key === key).labels[currentLanguage] }}</small>
          <b-form-group
            :id="'edit-' + kebabCase(key)"
            :invalid-feedback="invalidFeedback(key)"
          >
            <b-input
              :id="'input-' + kebabCase(key)"
              v-model="editedValues[key]"
              type="number"
              :min="1970"
              :max="new Date().getFullYear()"
              :description="formData.find(item => item.key === key).descriptions[currentLanguage]"
              :state="inputStates[key] ? inputStates[key].state : false"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row
        v-if="currentStep > 0 && currentStep < steps.length"
        class="mt-3"
      >
        <b-col cols="12">
          <h4>Data from previous step </h4>
        </b-col>
        <b-col>
          <EducationCard
            :education-data="editedValues"
            :language="steps[currentStep-1].languageKey"
          />
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <b-card-group
        v-for="langKey in Object.keys(usedLanguages)"
        :key="'preview-in-' + langKey"
        deck
      >
        <EducationCard
          :education-data="editedValues"
          :language="langKey"
        />
      </b-card-group>
    </div>
    <b-btn
      id="save"
      class="pull-right"
      variant="success"
      @click="handleNextButton()"
    >
      {{ currentStep === steps.length - 1 ? 'Save' : 'Next' }}
    </b-btn>
    <b-btn
      id="cancel"
      type="button"
      variant="light"
      class="pull-right"
      @click="handleBackButton()"
    >
      {{ currentStep === 0 ? 'Cancel' : 'Back' }}
    </b-btn>
  </div>
</template>

<script>
import { kebabCase, cloneDeep } from 'lodash'
import { EducationCard } from '@/components/Common'

export default {
  name: 'EditEducationForm',
  components: { EducationCard },
  props: {
    initialValues: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      validated: false,
      editedValues: cloneDeep(this.initialValues),
      currentStep: 0,
      usedLanguages: {
        fi: { label: 'Suomeksi' },
        en: { label: 'in English' }
      },
      formData: [
        { key: 'school',
          labels: {
            fi: 'Oppilaitoksen nimi *',
            en: 'Place of education *'
          },
          descriptions: {
            fi: 'Oppilaitoksen nimi, esim. Aalto-yliopisto',
            en: 'Name of the shool or institution, e.g. Aalto University'
          }
        },
        { key: 'degree',
          labels: {
            fi: 'Tutkinnon nimi *',
            en: 'Degree *'
          },
          descriptions: {
            fi: 'Tutkinnon nimi, esim. Tietotekniikan diplomi-insinööri',
            en: 'e.g. M.Sc. (tech) in Computer Science'
          }
        },
        { key: 'major',
          labels: {
            fi: 'Pääaine',
            en: 'Major'
          },
          descriptions: {
            fi: 'Pääaineen/suuntautumisen nimi, esim. Ohjelmistotekniikka',
            en: 'Name of the major/study track, e.g Computer Science'
          }
        },
        { key: 'minor',
          labels: {
            fi: 'Sivuaine',
            en: 'Minor'
          },
          descriptions: {
            fi: 'Sivuaineen nimi, esim. Geoinformatiikka',
            en: 'Name of the minor studied, e.g. Geoinformatics'
          }
        },
        { key: 'startYear', labels: { fi: 'Aloitusvuosi *', en: '' }, descriptions: { fi: '', en: '' } },
        { key: 'endYear', labels: { fi: 'Lopetusvuosi', en: '' }, descriptions: { fi: '', en: '' } }

      ],
      steps: [
        { languageKey: 'fi', useFormTemplate: true, stepTitle: 'Täytä tiedot suomeksi' },
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
        {
          state: !!this.editedValues.startYear,
          feedback: 'Starting year is required'
        },
        this.isValidYear(this.editedValues.startYear)
      ]
      return {
        state: this.validated ? rules.every(item => item.state) : undefined,
        feedback: rules.filter(item => !item.state).map(item => item.feedback).join('\n')
      }
    },
    inputStates () {
      return {
        school: {
          fi: { state: this.validated ? this.editedValues.fi.school.length > 0 : null, feedback: 'Required' },
          en: { state: this.validated ? this.editedValues.en.school.length > 0 : null, feedback: 'Required' }
        },
        degree: {
          fi: { state: this.validated ? this.editedValues.fi.degree.length > 0 : null, feedback: 'Required' },
          en: { state: this.validated ? this.editedValues.en.degree.length > 0 : null, feedback: 'Required' }
        },
        startYear: this.startYearState,
        endYear: this.editedValues.endYear && this.validated ? this.isValidYear(this.editedValues.endYear) : { state: undefined, feedback: '' }
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
        state: year ? Number(year) >= 1970 && Number(year) <= new Date().getFullYear() : undefined,
        feedback: `Invalid year, should be between 1970-${new Date().getFullYear()}`
      }
    },
    invalidFeedback (key, langKey = null) {
      if (this.inputStates[key] && this.inputStates[key].state !== undefined) {
        const state = this.inputStates[key].state
        // Handle both cases: state.[lang] == true and state == true
        if (state[langKey] || state === true) {
          return ''
        } else {
          return this.inputStates[key].feedback
        }
      } else if (!this.inputStates[key]) {
        return ''
      }
      return this.inputStates[key][langKey] ? this.inputStates[key][langKey].feedback : ''
    },
    formIsValidByLanguage (langKey) {
      const statesForLanguage = Object.keys(this.inputStates).map(key => {
        const item = this.inputStates[key]
        if (item.hasOwnProperty(langKey)) {
          return !!item[langKey].state
        } else {
          return !!(item.state || item.state === undefined)
        }
      })
      return statesForLanguage.every(state => state)
    },
    handleNextButton () {
      this.validated = true
      if (this.currentStep < this.steps.length - 1 && this.canContinue) {
        ++this.currentStep
        this.validated = false
      } else if (this.canContinue) {
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
</style>
