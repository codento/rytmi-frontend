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
import { LANGUAGE_ENUM } from '@/utils/constants'

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
  computed: {
    ...mapGetters([
      'skillCategories',
      'skillGroups',
      'currentLanguage'
    ]),
    sortedSkillCategories () {
      const categoryArray = Object.values(this.skillCategories).map(category => {
        if ([LANGUAGE_ENUM.LANGUAGE_GROUP_NAME, 'Uncategorized'].includes(category.title[this.currentLanguage])) {
          return { ...category, disabled: true }
        } else {
          return category
        }
      }).sort((a, b) => {
        return a.disabled ? 1 : b.disabled ? -1 : a.title[this.currentLanguage].localeCompare(b.title[this.currentLanguage])
      })
      categoryArray.unshift({ id: null, skillGroupId: null })
      return categoryArray
    },
    sortedSkillGroups () {
      const groupArray = Object.values(this.skillGroups).map(group => {
        if ([LANGUAGE_ENUM.LANGUAGE_GROUP_NAME, 'Uncategorized'].includes(group.title[this.currentLanguage])) {
          return { ...group, disabled: true }
        } else {
          return group
        }
      }).sort((a, b) => {
        return a.disabled ? 1 : b.disabled ? -1 : a.title[this.currentLanguage].localeCompare(b.title[this.currentLanguage])
      })
      groupArray.unshift({ id: null, skillGroupId: null })
      return groupArray
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
