<template>
  <b-row
    v-b-tooltip.hover.top="description"
    :disabled.sync="disableTooltip"
    class="my-1"
    align-v="center"
  >
    <b-col
      cols="4"
      class="text-right"
    >
      {{ skillName(skillId) }}
    </b-col>
    <b-col
      cols="8"
      @mouseenter="active = id"
      @mouseleave="active = null"
    >
      <b-progress
        :max="5"
        :class="showSkillsOnly ? 'my-2' : 'mt-1'"
      >
        <b-progress-bar
          :value="knows"
          variant="c-orange"
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
        class="mb-1"
      >
        <b-progress-bar
          :value="wantsTo"
          variant="c-orange-light"
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
    },
    disableTooltip: {
      type: Boolean,
      default: false
    },
    selectable: {
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
      return proficiencyDesc.knows['en'][this.knows]
    },
    wantsToDesc: function () {
      return proficiencyDesc.wants[this.wantsTo]
    }
  },
  methods: {
    selectSkill (skillId) {
      this.$emit('skill-selected', skillId)
    }
  }
}
</script>

<style scoped>
.skilldesc-center {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
