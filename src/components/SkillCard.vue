<template>
  <b-card 
    :title="getSkillName"
    tag="skill"
    style="max-width: 20rem;" >
  <b-row >
    <b-col class="col-mb-3 nohover" style="text-size: 20px;">
      <b>Wants</b>:
    </b-col>
    <b-col class="col-mb-9" >
      <b-progress
        height="0.9rem"
        :value="skill.wantsTo*20" 
        variant='primary' 
        class="mb-6"
      />
    </b-col>
  </b-row>
  <b-row>
    <b-col class="col-mb-3" style="text-size: 20px;">
      <b>Knows</b>:
    </b-col>
    <b-col class="col-mb-9" >
      <b-progress
        height="0.9rem"
        :value="skill.knows*20" 
        variant='primary' 
        class="mb-6"
      />
    </b-col>
  </b-row>
</b-card>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: 'SkillCard',
  props: {'skill': Object},
  computed: {
    ...mapGetters(['skillById']),
    getSkillName () {
      const skill = this.skillById(this.skill.skillId)
      if (!skill) {
        return ''
      }
      return skill.name
    }
  }
}
</script>
<style scoped>

</style>
