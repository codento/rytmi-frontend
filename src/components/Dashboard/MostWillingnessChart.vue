<template>
  <chart-card>
    <template slot="header">
      <h2>Preferred skills</h2>
    </template>
    <b-col>
      <p class="lead px-2">
        Employees are most enthusiastic about
        <strong>{{ mostWillingnessToWorkWith.name }}</strong>. <br>
        There are <strong>{{ mostWillingnessToWorkWith.numberOfPeople }}</strong> people
        who would prefer working with the tech
        and our current skill level average is
        <strong>{{ mostWillingnessToWorkWith.currentKnowledgeAverage }}</strong>
      </p>
    </b-col>
  </chart-card>
</template>

<script>
import ChartCard from './ChartCard'

export default {
  name: 'MostWillingnessChart',
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
    mostWillingnessToWorkWith () {
      let mostWillingnessToWorkWith = {
        name: '',
        numberOfPeople: 0,
        currentKnowledgeAverage: 0
      }
      const skillId = Object.keys(this.skillInfo).reduce((accumulate, current) => {
        if (this.skillInfo[current].willingness.filter(this.filterTop).length >
             this.skillInfo[accumulate].willingness.filter(this.filterTop).length) {
          return current
        }
        return accumulate
      })
      const topSkill = this.skillInfo[skillId]
      mostWillingnessToWorkWith = { name: topSkill.name,
        numberOfPeople: topSkill.willingness.filter(this.filterTop).length,
        currentKnowledgeAverage: topSkill.proficiencyAverage }
      return mostWillingnessToWorkWith
    }
  },
  methods: {
    filterTop (val) {
      return val === 4 || val === 5
    }
  }
}
</script>
