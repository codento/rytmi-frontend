<template>
  <b-row class="" style="padding-bottom: 12px" v-b-tooltip.hover.top="desc">
    <b-col class="col-mb-4 text-right valign-middle" style="text-size: 20px;">
      <b>{{ name }}:</b>
    </b-col>
    <b-col class="col-mb-8" >
      <b-progress :max="5" class="mb-6" height="0.9rem">
        <b-progress-bar
          class="rytmi-progress-knowledge"
          :label="knows ? knows.toString() : ''"
          :value="knows"
        />
      </b-progress>
      <b-progress :max="5" class="mb-6" height="0.9rem">
        <b-progress-bar
          class="rytmi-progress-wants"
          :label="wants ? wants.toString() : ''"
          :value="wants"
        />
      </b-progress>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SkillRow',
  props: {
    'name': String,
    'wants': Number,
    'knows': Number,
    'desc': String
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

<style>
.tooltip-inner {
    max-width: 550px;
    width: inherit;
}
</style>

<style scoped>
.rytmi-progress-knowledge {
  background-color: #fda708;
}
.rytmi-progress-wants {
  background-color: #fedfa7;
}
.valign-middle {
  margin-top: auto;
  margin-bottom: auto;
}
</style>
