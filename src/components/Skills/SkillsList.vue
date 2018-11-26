<template>
  <div>
    <h2>The skills</h2>
    <b-table
      :items="mapSkillsToArray"
      striped
      hover
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SkillsList',
  data () {
    return {
      fields: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'description',
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['skills']),
    mapSkillsToArray () {
      const objectKeys = Object.keys(this.skills)
      const skillsArray = objectKeys.map(skillKey => this.skills[skillKey])
      skillsArray.sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1
        }
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
          return -1
        }
        return 0
      })
      return skillsArray
    }
  },
  methods: {
    removeSkill (item) {}
  }
}
</script>
<style scoped>
button {
  width: 5%;
  margin-top: 1em;
}
</style>
