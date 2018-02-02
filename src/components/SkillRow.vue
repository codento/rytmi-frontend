<template>
  <b-row>
    <b-col class="col-mb-4" style="text-size: 20px;"> <b>{{name }}</b>:</b-col>
    <b-col class="col-mb-8" >
      <b-progress
        height="0.9rem"
        :value="proficiency*20" 
        variant='primary' 
        class="mb-6"
      />
    </b-col>
  </b-row>
</template>
<script>
export default {
  name: 'SkillRow',
  props: {'proficiency': Number, 'name': String}
}
</script>
<style scoped>

</style>
