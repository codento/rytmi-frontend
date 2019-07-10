<template>
  <b-card
    class="my-2 certificate-or-other-preview"
    no-header
    no-body
  >
    <b-card-body>
      <b-card-text>
        <h4>{{ certificateOrOther[language].name }} <span class="small">{{ certificateOrOther.year }}</span></h4>
        <p> {{ certificateOrOther[language].description }} </p>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
import { LANGUAGE_ENUM } from '@/utils/constants'

export default {
  name: 'CertificateOrOtherCard',
  props: {
    certificateOrOther: {
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
.certificate-or-other-preview > h4 {
  font-weight: bolder;
}
</style>
