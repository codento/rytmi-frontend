<template>
  <b-container>
    <b-row>
      <b-col><SkillForm /></b-col>
    </b-row>
    <b-row>
      <b-col>
        <SkillsList /></b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  SkillForm,
  SkillsList
} from '../components/Skills'

export default {
  name: 'Skills',
  components: {
    SkillForm,
    SkillsList
  }
}
</script>
