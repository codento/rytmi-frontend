<template>
  <b-card
    class="my-2 education-preview"
    no-header
    no-body
  >
    <b-card-body>
      <b-card-text>
        <h4>{{ certificateData[language].name }} <span class="small">{{ certificateData.year }}</span></h4>
        <p> {{ certificateData[language].description }} </p>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'CertificateCard',
  props: {
    certificateData: {
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
  }
}
</script>

<style scoped >
.certificate-preview > h4 {
  font-weight: bolder;
}
</style>
