
'
<template>
  <div class="animated fadeIn">
    <b-container fluid>
      <h1>Taidot</h1>
      <b-row > 
        <b-col v-for="skill, index in profile.skills"  class="col-sm-4">
          <div v-on:click="deleteSkill(index)">
          <skill-card :skill="skill"  :name="skill.name"/>
          </div>
        </b-col>
        <b-col class="col-sm-4">
          <b-card
          class="addNew"
          title="Add new"
          v-on:click="addNew()"
          />
        </b-col>       
      </b-row>  
    </b-container>
  </div>
</template>

<script>
import SkillCard from '../components/SkillCard'
import skillUtils from '../utils/skillUtils'
export default {
  name: 'EditProfile',
  components: {
    SkillCard
  },
  methods: {
    deleteSkill (skill) {
      this.profile.skills.splice(skill, 1)
    },
    addNew () {
      const skills = skillUtils.getSkills()
      this.profile.skills.push(
        {
          name: skills[Math.floor(Math.random() * skills.length)],
          knows: Math.floor(Math.random() * 5),
          wantsTo: Math.floor(Math.random() * 3) + 1,
          id: this.profile.skills.length + 1})
    }
  },
  data () {
    return {
      profile: {
        id: 0,
        firstName: 'Nicholas',
        lastName: 'Cage',
        title: 'Actor',
        email: 'jari.sillanpaa@codento.com',
        phone: '050 555 5555',
        description: 'Nori grape silver beet broccoli kombu beet greens fava bean potato quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant winter purslane fennel azuki bean earthnut pea sierra leone bologi leek soko chicory celtuce parsley jícama salsify. ',
        photo: 'https://baconmockup.com/300/200',
        accounts: [
          {type: 'facebook', address: 'linkedin.com/testprofile'},
          {type: 'linkedin', address: 'linkedin.com/testprofile'},
          {type: 'twitter', address: 'linkedin.com/testprofile'}
        ],
        skills: [
          {
            name: 'Vue.js',
            knows: 0,
            wantsTo: 2,
            id: 7
          },
          {
            name: 'Node.js',
            knows: 2,
            wantsTo: 1,
            id: 8
          },
          {
            name: 'JavaScript',
            knows: 2,
            wantsTo: 1,
            id: 0
          },
          {
            name: 'React.js',
            knows: 5,
            wantsTo: 2,
            id: 1
          },
          {
            name: 'CoffeeScript',
            knows: 4,
            wantsTo: 1,
            id: 2
          },
          {
            name: 'Angular v.4',
            knows: 3,
            wantsTo: 2,
            id: 3
          },
          {
            name: 'TypeScript',
            knows: 3,
            wantsTo: 1,
            id: 4
          },
          {
            name: 'Java',
            knows: 4,
            wantsTo: 0,
            id: 5
          },
          {
            name: 'Python',
            knows: 3,
            wantsTo: 2,
            id: 6
          }
        ]
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.card :hover{
  background-color: hsla(34, 100%, 51%, 0.541);

}
</style>
