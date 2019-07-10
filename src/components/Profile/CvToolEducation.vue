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
          v-for="(certificateItem, index) in certificateList"
          :key="'certificate-' + index"
          deck
        >
          <CertificateCard
            :certificate-data="certificateItem"
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
import { CertificateCard } from '@/components/Common'

export default {
  name: 'CvToolEducation',
  components: {
    EducationCard,
    CertificateCard
  },
  props: {
    educationList: {
      type: Array,
      required: true
    },
    certificateList: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters(['currentLanguage'])
  }
}
</script>
