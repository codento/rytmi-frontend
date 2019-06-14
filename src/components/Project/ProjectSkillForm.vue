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
            class="fa fa-trash icon"
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
        ok-only
      >
        Click on a skill to add it to the project
        <b-input
          v-model="skillFilterText"
          class="my-3"
          type="text"
          placeholder="Filter by skill name"
        />
        <div
          v-for="skill in projectSkillList"
          :key="skill.label"
          class="skill-item mx-1 my-1"
          @click.once="triggerAddProjectSkill(skill)"
        >
          {{ skill.label }}
        </div>
      </b-modal>
    </b-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import orderBy from 'lodash/orderBy'

export default {
  name: 'ProjectSkillForm',
  props: {
    projectId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      skillFilterText: ''
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById',
      'activeProjectSkills'
    ]),
    projectSkillList () {
      if (this.skills) {
        const unorderedSkills = Object.values(this.skills)
          .filter(skill =>
            !this.activeProjectSkills.map(projectSkill => projectSkill.skillId).includes(skill.id))
          .map(skill => ({
            label: skill.name,
            id: skill.id
          }))
        return orderBy(unorderedSkills.filter(skill => skill.label.toLowerCase().includes(this.skillFilterText.toLowerCase())), [skill => skill.label.toLowerCase()])
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
        this.skillFilterText = ''
      } catch (error) {
        this.$toasted.global.rytmi_error({ message: error.message })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
button {
  width: 100%;
  margin-top: 1em;
}
.fa {
  color: gray;
}
.icon:hover {
  color: black;
  cursor: pointer;
}
.skill-item {
  float: left;
  padding: 5px 10px;
  background-color: $c-light;
  border-radius: 10px;
}
  .skill-item:hover {
    background-color: $c-dark;
    cursor: pointer;
  }
</style>
