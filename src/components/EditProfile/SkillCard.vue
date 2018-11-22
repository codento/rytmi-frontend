<template>
  <b-card
    :title="getSkillName"
    class="skillCard"
    style="max-width: 20rem;"
  >
    <b-button-close
      class="top-right"
      @click="$emit('removeSkill', skill.id)"
    />
    <b-row>
      <b-col
        class="col-mb-3"
        style="text-size: 20px;"
      >
        <b>Wants</b>:
      </b-col>
      <b-col class="col-mb-9">
        <b-progress
          :value="skill.wantsTo*20"
          height="0.9rem"
          variant="primary"
          class="mb-6"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        class="col-mb-3"
        style="text-size: 20px;"
      >
        <b>Knows</b>:
      </b-col>
      <b-col class="col-mb-9">
        <b-progress
          :value="skill.knows*20"
          height="0.9rem"
          variant="primary"
          class="mb-6"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>{{ skill.description }}</b-col>
    </b-row>
  </b-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SkillCard',
  props: { 'skill': Object },
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

.top-right {
  position: absolute;
  top:3px;
  right: 3px;
}

</style>
