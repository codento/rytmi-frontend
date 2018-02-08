<template lang="html">
  <ul>
    <li v-for='profile in profiles'>
      <b-card>
        <b-row>
          <b-col class="col-sm-4" style="text-align:center">
            <img :src='profile.photoPath' alt="">
            <h3>{{profile.firstName}} {{profile.lastName}}</h3>
            <b>Email: {{profile.email}}</b><br>
            <b>puhelinnumero: {{profile.phone}}</b>
          </b-col>
          <b-col class="skills">
            <SkillRow class="col-sm-6" v-for='skill in skills' :name="skill.name" :proficiency='4' :key='skill.id'></SkillRow>
          </b-col>
        </b-row>
      </b-card>
    </li>
  </ul>
</template>

<script>
import SkillRow from '../SkillRow'

export default {
  name: 'Results',
  props: {
    'profiles': Array
  },
  components: {
    SkillRow
  }
}
</script>

<style lang="css">
</style>
