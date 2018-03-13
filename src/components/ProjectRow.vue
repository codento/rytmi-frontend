<template>
  <div class="row mb-1" v-on:click="show = !show">
    <div class="col-sm-12">
      <span style="font-size: 24px;" >{{project.title}} </span>
    </div>
    <div class="col-sm-12" >
       <span style="color: #f89500; font-size: 16px;">
          {{project.name}}  {{project.startDate}} - {{project.endDate}} 
        </span>
    </div>
    <transition name="fade">
      <div class="col-sm-12" v-if="show">
        {{project.description}}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ProjectRow',
  data () {
    return {
      show: false
    }
  },
  props: {
    'project': Object
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

span {
  user-select: none;
}
</style>
