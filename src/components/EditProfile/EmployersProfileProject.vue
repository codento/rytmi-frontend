<template>
  <div class="clickable">
    <span>
      {{ getDescriptionWithCurrentLanguage(project).name }}
    </span>
    <span>
      {{ '|' }}
    </span>
    <span>
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
    project: Object,
    editable: {
      type: Boolean,
      default: true
    },
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
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
</style>
