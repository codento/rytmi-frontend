<template>
  <div class="animated fadeIn col-sm-12 col-md-8 project-list-container">
    <b-container>
      <h1>Projects</h1>
      <CollapsableItem title="Add a new project">
        <ProjectFormWrapper
          v-if="Object.values(employers).length > 0"
          :editable-project="null"
          is-new-project
        />
        <div v-else>
          Loading employers...
        </div>
      </CollapsableItem>
      <ProjectList />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { CollapsableItem } from '../components/Common'
import {
  ProjectFormWrapper,
  ProjectList
} from '../components/Project'

export default {
  name: 'Projects',
  components: {
    ProjectFormWrapper,
    ProjectList,
    CollapsableItem
  },
  computed: {
    ...mapGetters(['employers'])
  },
  mounted () {
    document.title = 'Rytmi - Projects'
  }
}
</script>

<style scoped >
.project-list-container {
  margin: 0 auto;
}
</style>
