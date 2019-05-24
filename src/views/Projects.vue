<template>
  <div class="animated fadeIn col-sm-12 col-md-8 project-list-container">
    <CollapsableItem title="Add a new project">
      <ProjectForm v-if="Object.values(employers).length > 0" />
      <div v-else>
        Loading employers...
      </div>
    </CollapsableItem>
    <ProjectList />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CollapsableItem } from '../components/Common'
import {
  ProjectForm,
  ProjectList
} from '../components/Project'

export default {
  name: 'Projects',
  components: {
    ProjectForm,
    ProjectList,
    CollapsableItem
  },
  computed: {
    ...mapGetters(['employers'])
  },
  mounted () {
    document.title = 'Rytmi - Project List'
  }
}
</script>

<style scoped >
.project-list-container {
  margin: 0 auto;
  padding: 1em 0;
}
</style>
