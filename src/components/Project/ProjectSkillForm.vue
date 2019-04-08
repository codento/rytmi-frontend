<template>
  <div>
    <b-form
      id="project-skill-form"
      @submit="onSubmit"
    >
      <ul>
        <li
          v-for="skill of projectSkills"
          :key="skill.skillId"
          :class="skillsToDelete.includes(skill.skillId) ? 'marked-for-deletion' : ''"
        >
          {{ skillById(skill.skillId).name }}
          <i
            :class="skillsToDelete.includes(skill.skillId) ? 'fa-undo' : 'fa-trash'"
            class="fa"
            @click="markForDeletionOrCancel(skill.skillId)"
          />
        </li>
        <li
          v-for="skill of newSkills"
          :key="skill"
          class="new-skill"
        >
          {{ skillById(skill).name }}
          <i
            class="fa fa-trash"
            @click="deleteNewSkill(skill)"
          />
        </li>
      </ul>
      <v-select
        id="addProjectSkillDropdown"
        v-model="skillToAdd"
        :options="skillList"
      />
      <b-button
        primary
        type="submit"
      >
        Submit
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'ProjectSkillForm',
  components: { vSelect },
  props: {
    projectId: {
      type: Number,
      default: null
    },
    projectSkills: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      skillToAdd: null,
      newSkills: [],
      skillsToDelete: []
    }
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillById'
    ]),
    skillList () {
      if (this.skills) {
        return Object.values(this.skills)
          .filter(skill =>
            !this.newSkills.includes(skill.id) &&
            !this.projectSkills.map(projectSkill => projectSkill.skillId).includes(skill.id))
          .map(skill => ({
            label: skill.name,
            id: skill.id
          }))
      }
      return []
    }
  },
  watch: {
    skillToAdd: function () {
      this.newSkills.push(this.skillToAdd.id)
    }
  },
  methods: {
    markForDeletionOrCancel (skillId) {
      if (this.skillsToDelete.includes(skillId)) {
        this.skillsToDelete = this.skillsToDelete.filter(skill => skill !== skillId)
      } else {
        this.skillsToDelete.push(skillId)
      }
    },
    deleteNewSkill (skillId) {
      this.newSkills = this.newSkills.filter(skill => skill !== skillId)
    },
    onSubmit (evt) {

    }
  }
}
</script>
<style scoped>
button {
  width: 100%;
  margin-top: 1em;
}
.new-skill {
  color: #007700;
}
.fa {
  color: gray;
}
.marked-for-deletion {
  text-decoration: line-through;
  color: #990000;
}
</style>
