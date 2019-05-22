<template>
  <b-card
    id="education"
    class="mt-2 mb-2"
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Education
    </h5>
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
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { EducationCard } from '@/components/Common'

export default {
  name: 'CvToolEducation',
  components: {
    EducationCard
  },
  props: {
    educationList: Array
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['currentLanguage'])
  },
  methods: {}
}
</script>
