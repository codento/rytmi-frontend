<template>
  <div>
    <loading v-if="!skillsLoaded" />
    <b-container v-else>
      <SkillList :skill-list="skillList" />
    </b-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  SkillList
} from '../components/Skills'

export default {
  name: 'Skills',
  components: {
    SkillList
  },
  computed: {
    ...mapGetters([
      'skills',
      'skillCategoryById',
      'skillGroupById'
    ]),
    skillList () {
      return this.skills ? Object.keys(this.skills).map(skillId => {
        const skill = { ...this.skills[skillId] }
        const skillCategory = skill ? this.skillCategoryById(skill.skillCategoryId) : null
        const skillGroup = skillCategory ? this.skillGroupById(skillCategory.skillGroupId) : null
        const newProperties = {
          skillCategoryName: skillCategory ? skillCategory.title : undefined,
          skillGroupId: skillGroup ? skillGroup.id : undefined,
          skillGroupName: skillGroup ? skillGroup.title : undefined
        }
        return { ...skill, ...newProperties }
      }) : []
    },
    skillsLoaded () {
      return this.skillList.every(skill => skill.skillCategoryName && skill.skillGroupName)
    }
  }
}
</script>
