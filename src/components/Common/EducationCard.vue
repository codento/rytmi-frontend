<template>
  <b-card
    class="my-2 education-preview"
    no-header
    no-body
  >
    <b-card-body>
      <b-card-text>
        <h4> {{ educationData[language].school }} <span class="small"> {{ educationData.startYear }} - {{ educationData.endYear }}</span></h4>
        <h5 v-if="educationData[language].degree">
          {{ educationData[language].degree }}
        </h5>
        <p>
          <span v-if="educationData[language].major">
            {{ labels[language].majorLabel }}: {{ educationData[language].major }}
          </span>
          <br>
          <span v-if="educationData[language].minor">
            {{ labels[language].minorLabel }}: {{ educationData[language].major }}
          </span>
        </p>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'EducationCard',
  props: {
    educationData: {
      type: Object,
      required: true
    },
    language: {
      type: Text.language,
      required: true,
      validator: (value) => {
        return LANGUAGE_ENUM.LANGUAGES.map(item => item.id).indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      labels: {
        fi: { majorLabel: 'Pääaine', minorLabel: 'Sivuaine' },
        en: { majorLabel: 'Major', minorLabel: 'Minor' }
      }
    }
  }
}
</script>

<style scoped >
.education-preview > h4 {
  font-weight: bolder;
}
.education-preview {
  max-width: 600px;
}
</style>
