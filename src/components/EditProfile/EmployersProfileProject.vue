<template>
  <div>
    <span
      class="clickable"
      @click="projectClicked"
    >
      {{ getDescriptionWithCurrentLanguage(project).name }}
    </span>
    <span>
      {{ '|' }}
    </span>
    <span
      class="clickable"
      @click="profileProjectClicked"
    >
      {{ getDescriptionWithCurrentLanguage(profileProject).title }}
    </span>
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
    projectClicked () {
      this.$emit('projectClicked', this.project)
    },
    profileProjectClicked () {
      this.$emit('profileProjectClicked', this.profileProject)
    }
  }
}
</script>

<style scoped >
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
</style>
