<template>
  <b-row style="padding-bottom: 12px">
    <b-col class="col-mb-4" style="text-size: 20px;">
      <b>{{ name }}:</b>
    </b-col>
    <b-col class="col-mb-8" >
      <div @mouseover="active = true" @mouseleave="active = false">
        <div v-if="active">
          <b-progress
            height="0.9rem"
            class="mb-6"
          >Osaaminen</b-progress>
          <b-progress
            height="0.9rem"
            class="mb-6"
          >Halukkuus</b-progress>
        </div>
        <div v-else>
          <b-progress
            height="0.9rem"
            :value="knows*20"
            variant='primary'
            class="mb-6"
          />
          <b-progress
            height="0.9rem"
            :value="wants*20"
            variant='success'
            class="mb-6"
          />
        </div>
      </div>
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
    'wantsTo': Number,
    'wants': Number,
    'knows': Number
  },
  data () {
    return {
      active: false
    }
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
