<template>
  <b-card
    id="education"
    class="mt-2 mb-2"
  >
    <div
      slot="header"
      class="mb-0"
    >
      <slot name="custom-header">
        Education
      </slot>
    </div>
    <slot name="custom-content" />
    <b-row>
      <b-col sm="6">
        <b-card-group
          v-for="(educationItem, index) in educationList"
          :key="'education-' + index"
          deck
        >
          <EducationCard
            :education-data="educationItem"
            :language="currentLanguage"
          />
        </b-card-group>
      </b-col>
      <b-col sm="6">
        <b-card-group
          v-for="(certificateOrOtherItem, index) in certificateOrOtherList"
          :key="'certificate-' + index"
          deck
        >
          <CertificateOrOtherCard
            :certificate-or-other="certificateOrOtherItem"
            :language="currentLanguage"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { EducationCard } from '@/components/Common'
import { CertificateOrOtherCard } from '@/components/Common'

export default {
  name: 'CvToolEducation',
  components: {
    EducationCard,
    CertificateOrOtherCard
  },
  props: {
    educationList: {
      type: Array,
      required: true
    },
    certificateOrOtherList: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentLanguage'])
  }
}
</script>
