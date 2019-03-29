<template>
  <b-row
    v-b-tooltip.hover.top="description"
    class="skillRow"
  >
    <b-col
      :class="{ skillname:true, 'skillname-highlight': highlight, 'text-right': true, 'valign-middle': true }"
      cols="4"
    >
      {{ skillName(skillId) }}:
    </b-col>
    <b-col
      cols="8"
      class=""
      @mouseenter="active = id"
      @mouseleave="active = null"
    >
      <b-progress
        :max="5"
        class="mb-6"
        height="0.9rem"
      >
        <b-progress-bar
          :value="knows"
          class="rytmi-progress-knowledge"
        >
          <slot
            v-if="active !== id"
            name="label"
          >
            {{ knows ? knows.toString() : '' }}
          </slot>
        </b-progress-bar>
        <span
          v-show="active === id"
          class="skilldesc-center"
        >
          {{ knowsToDesc.text }}
        </span>
      </b-progress>
      <b-progress
        v-show="!showSkillsOnly"
        :max="5"
        class="mb-6"
        height="0.9rem"
      >
        <b-progress-bar
          :value="wantsTo"
          class="rytmi-progress-wants"
        >
          <slot
            v-if="active !== id"
            name="label"
          >
            {{ wantsTo ? wantsTo.toString() : '' }}
          </slot>
        </b-progress-bar>
        <span
          v-show="active === id"
          class="skilldesc-center"
        >{{ wantsToDesc.text }}</span>
      </b-progress>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex'
import proficiencyDesc from '@/assets/proficiencyDesc'

export default {
  name: 'SkillRow',
  props: {
    id: Number,
    skillId: Number,
    wantsTo: Number,
    knows: Number,
    description: String,
    highlight: Boolean,
    showSkillsOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: null
    }
  },
  computed: {
    ...mapGetters([
      'skillById',
      'skillName'
    ]),
    knowsToDesc: function () {
      return proficiencyDesc.knows[this.knows]
    },
    wantsToDesc: function () {
      return proficiencyDesc.wants[this.wantsTo]
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
.skillrow {
  padding-bottom: 12px;
}
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
.skillname {
  color: gray;
  font-weight: bolder;
}
.skillname-highlight {
  color: black;
  font-weight: 700;
}
</style>
