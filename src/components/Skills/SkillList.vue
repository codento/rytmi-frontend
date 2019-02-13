<template>
  <div>
    <h2>The skills</h2>
    <b-table
      id="skill-list-table"
      :items="mapSkillsToArray"
      :fields="fields"
      striped
      hover
      @row-clicked="openEditModal"
    />
    <b-modal
      ref="editSkillModal"
      hide-header
      hide-footer
      @hidden="resetSelectedSkill"
    >
      <edit-skill
        v-if="selectedSkill"
        :skill="selectedSkill"
        :skill-categories="skillCategories"
        :close="closeEditModal"
        :people-with-skill="calculatePeopleWithSelectedSkill"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { orderBy } from 'lodash'
import EditSkill from './EditSkill'

const mapSkillRow = (skill, skillCategories) => ({
  id: skill.id,
  skillCategoryId: skill.skillCategoryId,
  name: skill.name,
  description: skill.description,
  created: format(skill.createdAt, 'D.M.YYYY'),
  lastUpdate: format(skill.createdAt, 'D.M.YYYY')
})

export default {
  name: 'SkillsList',
  components: {
    EditSkill
  },
  data () {
    return {
      selectedSkill: null,
      fields: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'skillCategoryId',
          label: 'Skill Category',
          sortable: true,
          formatter: 'getSkillCategoryTitle'
        },
        {
          key: 'description',
          sortable: true
        },
        {
          key: 'created',
          sortable: true
        },
        {
          key: 'lastUpdate',
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['skills', 'skillCategories', 'skillProfiles']),
    mapSkillsToArray () {
      const objectKeys = Object.keys(this.skills)
      const skillsArray = objectKeys.map(skillKey => mapSkillRow(this.skills[skillKey], this.skillCategories))
      return orderBy(skillsArray, [skill => skill.name.toLowerCase()], ['asc'])
    },
    calculatePeopleWithSelectedSkill () {
      if (this.selectedSkill) {
        return this.skillProfiles.filter(profile => profile.skillId === this.selectedSkill.id).length
      }
      return 0
    }
  },
  methods: {
    openEditModal (event) {
      this.selectedSkill = this.skills[event.id]
      this.$refs.editSkillModal.show()
    },
    resetSelectedSkill () {
      this.selectedSkill = null
    },
    closeEditModal () {
      this.resetSelectedSkill()
      this.$refs.editSkillModal.hide()
    },
    getSkillCategoryTitle (id) {
      return Object.keys(this.skillCategories).length > 0 && id ? this.skillCategories[id].title : ''
    }
  }
}
</script>

<style>
#skill-list-table td:nth-child(3), #skill-list-table th:nth-child(3) {
  width: 40%;
}
</style>

<style scoped>
button {
  width: 5%;
  margin-top: 1em;
}
</style>
