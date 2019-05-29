<template>
  <div>
    <h3>Manage skill categories and groups</h3>
    <hr>
    <SkillListAdminPanelItem
      is-skill-category
      :list-items="sortedSkillCategories"
      label="Skill category"
      :update-action="updateSkillCategory"
      :create-action="addSkillCategory"
    >
      <h4 slot="group-title">
        Edit skill categories
      </h4>
    </SkillListAdminPanelItem>
    <hr>
    <SkillListAdminPanelItem
      :is-skill-category="false"
      :list-items="sortedSkillGroups"
      label="Skill group"
      :update-action="updateSkillGroup"
      :create-action="addSkillGroup"
    >
      <h4 slot="group-title">
        Edit skill groups
      </h4>
    </SkillListAdminPanelItem>
    <b-row class="mt-3">
      <b-col
        md="2"
        cols="3"
      >
        <b-button
          id="close-admin-modal"
          type="button"
          variant="light"
          @click="close()"
        >
          Close
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SkillListAdminPanelItem from './SkillListAdminPanelItem.vue'

export default {
  name: 'SkillListAdminPanel',
  components: {
    SkillListAdminPanelItem
  },
  props: {
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'skillCategories',
      'skillGroups'
    ]),
    sortedSkillCategories () {
      const mappedCategories = Object.values(this.skillCategories).map(category => {
        return { id: category.id, title: category.title, skillGroupId: category.skillGroupId }
      }).sort((a, b) => a.title.localeCompare(b.title))
      mappedCategories.unshift({ id: null, skillGroupId: null })
      return mappedCategories
    },
    sortedSkillGroups () {
      const mappedGroups = Object.values(this.skillGroups).map(group => {
        return { id: group.id, title: group.title }
      }).sort((a, b) => a.title.localeCompare(b.title))
      mappedGroups.unshift({ id: null, skillGroupId: null })
      return mappedGroups
    }
  },
  methods: {
    ...mapActions([
      'addSkillCategory',
      'addSkillGroup',
      'updateSkillCategory',
      'updateSkillGroup'
    ])
  }
}
</script>
