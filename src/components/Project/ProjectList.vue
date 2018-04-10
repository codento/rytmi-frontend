<template>
  <ul>
  <li v-for='project in projects' :key="project.id">
    {{project.name}}
  </li>
  </ul>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectList',
  computed: {
    ...mapGetters([
      'projects'
    ])
  }
}
</script>