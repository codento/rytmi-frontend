<template>
  <chart-card>
    <template slot="header">
      <h2>Top skill</h2>
    </template>
    <b-col>
      <p class="lead px-2">
        Our top skill is
        <strong>{{ topSkillLevel.name }}</strong>. <br>
        There are <strong>{{ topSkillLevel.numberOfPeople }}</strong> people
        who's skill level is 4 or 5 and the average is
        <strong>{{ topSkillLevel.currentKnowledgeAverage }}</strong>
      </p>
    </b-col>
  </chart-card>
</template>

<script>
import ChartCard from './ChartCard'

export default {
  name: 'TopSkillChart',
  components: {
    ChartCard
  },
  props: {
    skillInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    topSkillLevel () {
      let mostProficientSkill = {
        name: '',
        numberOfPeople: 0,
        currentKnowledgeAverage: 0
      }
      const skillId = Object.keys(this.skillInfo).reduce((accumulate, current) => {
        if (this.skillInfo[current].proficiencies.filter(this.filterTop).length >
             this.skillInfo[accumulate].proficiencies.filter(this.filterTop).length) {
          return current
        }
        return accumulate
      })
      const topSkill = this.skillInfo[skillId]
      mostProficientSkill = { name: topSkill.name,
        numberOfPeople: topSkill.willingness.filter(this.filterTop).length,
        currentKnowledgeAverage: topSkill.proficiencyAverage }
      return mostProficientSkill
    }
  },
  methods: {
    filterTop (val) {
      return val === 4 || val === 5
    }
  }
}
</script>
