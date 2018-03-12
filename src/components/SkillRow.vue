<template>
  <b-row style="padding-bottom: 12px">
    <b-col class="col-mb-4" style="text-size: 20px;">
      <b>{{ name }}:</b>
    </b-col>
    <b-col class="col-mb-8" >
      <b-progress
        height="0.9rem"
        :value="proficiency*20"
        variant='primary'
        class="mb-6"
      />
       <b-progress
        height="0.9rem"
        :value="wantsTo*20"
        variant='success'
        class="mb-6"
      />
    </b-col>
  </b-row>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SkillRow',
  props: {
    'proficiency': Number,
    'name': String,
    'skillId': Number,
    'wantsTo': Number
  },
  computed: {
    ...mapGetters([
      'skillById'
    ])
  }
}
</script>
<style scoped>

</style>
