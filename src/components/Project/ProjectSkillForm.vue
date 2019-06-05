<template>
  <div>
    <b-form
      id="project-skill-form"
      class="mx-2 my-2"
    >
      <ul>
        <li
          v-for="skill of activeProjectSkills"
          :key="skill.skillId"
        >
          {{ skillById(skill.skillId).name }}
          <i
            class="fa fa-trash"
            @click="removeSkill(skill)"
          />
        </li>
      </ul>
      <b-button v-b-modal.skill-modal>
        Add skills to project
      </b-button>
      <b-modal
        id="skill-modal"
        title="Add skills to project"
        centered
        ok-only
      >
        <b-list-group>
          Click on a skill to add it to the project
          <b-list-group-item
            v-for="skill of projectSkillList"
            :key="skill.id"
            name="skill"
            button
            @click="triggerAddProjectSkill(skill)"
          >
            {{ skill.label }}
          </b-list-group-item>
        </b-list-group>
      </b-modal>
    </b-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProjectSkillForm',
  props: {
    projectId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById',
      'activeProjectSkills'
    ]),
    projectSkillList () {
      if (this.skills) {
        return Object.values(this.skills)
          .filter(skill =>
            !this.activeProjectSkills.map(projectSkill => projectSkill.skillId).includes(skill.id))
          .map(skill => ({
            label: skill.name,
            id: skill.id
          }))
      }
      return []
    }
  },
  mounted: function () {
    this.fetchActiveProjectSkills(this.projectId)
  },
  beforeDestroy: function () {
    this.$store.commit('projectskills/SET_ACTIVE_PROJECTSKILLS', [])
  },
  methods: {
    ...mapActions([
      'addProjectSkill',
      'removeProjectSkill',
      'fetchActiveProjectSkills'
    ]),
    async removeSkill (skill) {
      try {
        await this.removeProjectSkill(skill.id)
        await this.fetchActiveProjectSkills(this.projectId)
        this.$toasted.global.rytmi_success({ message: 'Project skill removed succesfully!' })
      } catch (error) {
        this.$toasted.global.rytmi_error({ message: error.message })
      }
    },
    async triggerAddProjectSkill (skill) {
      const projectSkill = {
        skillId: skill.id,
        projectId: this.projectId
      }
      try {
        await this.addProjectSkill(projectSkill)
        await this.fetchActiveProjectSkills(this.projectId)
        this.$toasted.global.rytmi_success({ message: 'New project skill added succesfully!' })
      } catch (error) {
        this.$toasted.global.rytmi_error({ message: error.message })
      }
    }
  }
}
</script>
<style scoped>
button {
  width: 100%;
  margin-top: 1em;
}
.fa {
  color: gray;
}
</style>
