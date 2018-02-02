<template>
  <div class="row mb-1">
    <div class="col-sm-12">
      <span style="font-size: 24px;" >{{project.title}} </span>
    </div>
    <div class="col-sm-12" >
       <span style="color: #f89500; font-size: 16px;">
          {{project.name}}  {{project.startDate}} - {{project.endDate}} 
        </span>
    </div>
    <div class="col-sm-12">
      {{project.description}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectRow',
  props: {
    'project': Object
  }
}
</script>
<style scoped>

</style>
