<template>
  <b-container>
    <b-row>
      <b-col><SkillForm /></b-col>
    </b-row>
    <b-row>
      <b-col>
        <SkillList />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  SkillForm,
  SkillList
} from '../components/Skills'

export default {
  name: 'Skills',
  components: {
    SkillForm,
    SkillList
  }
}
</script>
