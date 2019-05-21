<template>
  <div>
    {{ getDescriptionWithCurrentLanguage(project).name }}, {{ getDescriptionWithCurrentLanguage(profileProject).title }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'EmployersProfileProject',
  props: {
    profileProject: Object,
    project: Object
  },
  computed: {
    ...mapGetters(['currentLanguage'])
  },
  methods: {
    getDescriptionWithCurrentLanguage (objectWithDescriptions) {
      if (!objectWithDescriptions.descriptions || !objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)) {
        return {
          language: this.currentLanguage,
          title: ''
        }
      }
      return objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)
    },
  }
}
</script>

<style scoped >

</style>
