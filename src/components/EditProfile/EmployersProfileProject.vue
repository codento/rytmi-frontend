<template>
  <div
    class="mt-2 mb-2"
    @mouseover="showEditIcon = true"
    @mouseout="showEditIcon = false"
  >
    <span>
      {{ getDescriptionWithCurrentLanguage(project).name }}
    </span>
    <span>
      {{ '|' }}
    </span>
    <span>
      {{ getDescriptionWithCurrentLanguage(profileProject).title }}
    </span>
    <span v-show="showEditIcon">
      <i class="fa fa-pencil pull-right" />
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
    }
  },
  data () {
    return {
      showEditIcon: false
    }
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
    }
  }
}
</script>

<style scoped >

</style>
