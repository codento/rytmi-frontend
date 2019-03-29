<template>
  <b-card
    id="work-experience"
    class="mt-2 mb-2"
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Work experience
    </h5>
    <h3>Codento</h3>
    <loading v-if="!profileProjects" />
    <ProjectRow
      v-for="profileProject in profileProjects"
      :key="profileProject.id"
      :profile-project="profileProject"
    />
    <h3>Other</h3>
  </b-card>
</template>
<script>
import { mapGetters } from 'vuex'
import ProjectRow from '@/components/Common/ProjectRow.vue'

export default {
  name: 'CvToolWorkExperience',
  components: {
    ProjectRow
  },
  props: {
    profile: Object
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['profileProjectsByProfileId']),
    profileProjects: function () {
      return this.profileProjectsByProfileId(this.profile.id)
    }
  }
}
</script>
