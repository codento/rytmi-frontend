<template>
  <b-row class="" style="padding-bottom: 12px" v-b-tooltip.hover.top="desc">
    <b-col class="col-mb-4 text-right valign-middle" style="text-size: 20px;">
      <b>{{ name }}:</b>
    </b-col>
    <b-col class="col-mb-8" @mouseenter="active = skillId" @mouseleave="active = null">
      <b-progress :max="5" class="mb-6" height="0.9rem">
        <b-progress-bar class="rytmi-progress-knowledge"
          :value="knows">
          <slot name="label" v-if="active !== skillId">{{ knows ? knows.toString()  : '' }}</slot>
        </b-progress-bar>
        <span v-if="active === skillId" class="skilldesc-center">{{ knowsToDesc.text }}</span>
      </b-progress>
      <b-progress :max="5" class="mb-6" height="0.9rem">
        <b-progress-bar class="rytmi-progress-wants"
          :value="wants">
          <slot name="label" v-if="active !== skillId">{{ wants ? wants.toString() : '' }}</slot>
        </b-progress-bar>
        <span v-if="active === skillId" class="skilldesc-center">{{ wantsToDesc.text }}</span>
      </b-progress>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import proficiencyDesc from '../../assets/proficiencyDesc'

export default {
  name: 'SkillRow',
  props: {
    'skillId': Number,
    'name': String,
    'wants': Number,
    'knows': Number,
    'desc': String
  },
  data () {
    return {
      active: null
    }
  },
  computed: {
    ...mapGetters([
      'skillById'
    ]),
    knowsToDesc: function () {
      return proficiencyDesc.knows[this.knows]
    },
    wantsToDesc: function () {
      return proficiencyDesc.wants[this.wants]
    }
  },
  methods: {
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
.skilldesc-center {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
