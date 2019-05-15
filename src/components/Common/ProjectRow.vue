<template>
  <div v-if="project">
    <div
      class="row mb-1"
      name="show-row"
      @click="show = !show"
    >
      <div class="col-sm-12">
        <router-link
          class="no-underline-router-link"
          :to="{ name: 'project', params: { id: '' + project.id }}"
        >
          <span class="project-header">{{ project.name }} </span>
        </router-link>
      </div>
      <div class="col-sm-12 duration-container">
        <span class="duration-item">
          <small>From</small><br>
          {{ profileProject.startDate | dateFilter }}
        </span>
        <span class="duration-item">
          <small>To</small><br>
          {{ profileProject.endDate | dateFilter }}
        </span>
      </div>
      <transition name="fade">
        <div
          v-if="show"
          class="col-sm-12"
        >
          {{ project.description }}
        </div>
      </transition>
    </div>
    <hr>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectRow',
  props: {
    profileProject: Object
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    ...mapGetters(['projectById']),
    project: function () {
      return this.projectById(this.profileProject.projectId)
    }
  }
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity .4s;
}

.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.duration-container {
  display: flex;
  justify-content: flex-start;
}
.duration-item {
  margin-right: 1em;
  color: gray;
}
small {
  color: black;
}
.project-header {
  color: hsl(39, 98%, 51%);
  font-weight: 500;
  font-size: 1.5em;
}
.no-underline-router-link:hover {
  text-decoration: none;
}
</style>
