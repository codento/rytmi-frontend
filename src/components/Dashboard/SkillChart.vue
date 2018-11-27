<template>
  <chart-card>
    <template slot="header">
      <div class="h3 px-2">Skills <i
        id="skill-explanations-icon"
        class="cui-info"/>
        <b-popover
          target="skill-explanations-icon"
          title="Skill level descriptions"
          triggers="hover focus">
          <skill-explanations
            :know-desc="proficiencyDescriptions.knows"
            :want-desc="proficiencyDescriptions.wants"
          />
        </b-popover>
      </div>
      <b-col>
        <v-select
          v-model="selectedSkills"
          multiple
          :options="selectFilterOptions"
        />
      </b-col>
    </template>
    <b-col
      cols="12"
      md="6" >
      <bar-chart
        :chart-data="barChartData"
        :options="barChartOptions"
      />
    </b-col>
    <b-col
      cols="12"
      md="6">
      <radar-chart
        :chart-data="radarChartData"
        :options="radarChartOptions"
      />
    </b-col>
  </chart-card>
</template>

<script>
import ChartCard from './ChartCard'
import RadarChart from '../Charts/RadarChart'
import BarChart from '../Charts/BarChart'
import { SkillExplanations } from '@/components/Profile'
import SelectFilter from '../helpers/SelectFilter'
import proficiencyDescriptions from '@/assets/proficiencyDesc'
import { sortBy } from 'lodash'
import vSelect from 'vue-select'

export default {
  components: {
    ChartCard,
    RadarChart,
    BarChart,
    SkillExplanations,
    SelectFilter,
    vSelect
  },
  props: {
    skills: {
      type: Object,
      required: true
    },
    skillInfo: {
      type: Object,
      required: true
    },
    profileList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedSkills: [],
      chartTitleFontSize: '16',
      proficiencyDescriptions,
      skillLevelColor: 'rgb(253, 167, 8, 0.4)',
      skillLevelBorderColor: 'rgb(253, 167, 8)',
      willingnessColor: 'rgb(66, 244, 92, 0.4)',
      willingnessBorderColor: 'rgb(66, 244, 92)',
      barChartColors: ['#ff3333', '#ff9234', '#ffcd3c', '#fefed5', '#35d0ba']
    }
  },
  computed: {
    skillsLength () {
      return Object.keys(this.skills).length
    },
    skillLabels () {
      return this.selectedSkills.map(skill => skill.label)
    },
    selectFilterOptions () {
      const unselectedSkills = this.mapSkillsForSkillFilter().filter(selectableSkill => !(this.selectedSkills.map(skill => skill.id)).includes(selectableSkill.id))
      return sortBy(unselectedSkills, ['label'])
    },
    barChartData () {
      return {
        labels: this.skillLabels,
        datasets: [
          {
            data: this.getNumberOfPeopleWithSelectedSkills(),
            backgroundColor: this.mapColors()
          }
        ]
      }
    },
    barChartOptions () {
      return {
        title: {
          display: true,
          fontSize: this.chartTitleFontSize,
          text: 'Number of consultants with given skill'
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: this.profileList.length / 2
            }
          }]
        }
      }
    },
    radarChartData () {
      const proficiencyAverages = this.selectedSkills.map(skill => this.skillInfo[skill.id].proficiencyAverage)
      const willingnessAverages = this.selectedSkills.map(skill => this.skillInfo[skill.id].willingnessAverage)
      return {
        labels: this.skillLabels,
        datasets: [
          {
            label: 'Skill level',
            backgroundColor: this.skillLevelColor,
            borderColor: this.skillLevelBorderColor,
            data: proficiencyAverages
          },
          {
            label: 'Willingness to work with',
            backgroundColor: this.willingnessColor,
            borderColor: this.willingnessBorderColor,
            data: willingnessAverages
          }
        ]
      }
    },
    radarChartOptions () {
      return {
        title: {
          display: true,
          text: 'Skill knowledge & willingness average',
          fontSize: this.chartTitleFontSize
        },
        scale: {
          ticks: {
            min: 0,
            max: 5,
            beginAtZero: true
          }
        }
      }
    }
  },
  mounted () {
    this.pickThreeMostKnownSkills()
  },
  methods: {
    getNumberOfPeopleWithSelectedSkills () {
      return this.selectedSkills.map(skill => this.skillInfo[skill.id].proficiencies.length)
    },
    filterChanged (val) {
      if (this.selectedSkills.includes(val)) {
        this.selectedSkills = this.selectedSkills.filter((skill) => val !== skill.id)
      } else {
        this.selectedSkills.push(val)
      }
    },
    mapColors () {
      let i = 0
      const dataSetColors = this.skillLabels.map(label => {
        const color = this.barChartColors[i]
        i++
        if (i >= this.barChartColors.length) {
          i = 0
        }
        return color
      })
      return dataSetColors
    },
    pickThreeMostKnownSkills () {
      const skillIds = Object.keys(this.skillInfo)
      skillIds.sort((a, b) => this.skillInfo[b].proficiencies.length - this.skillInfo[a].proficiencies.length)
      const top3SkillIds = skillIds.slice(0, 3).map(id => Number(id))
      this.selectedSkills = this.mapSkillsForSkillFilter().filter(skill => top3SkillIds.includes(skill.id))
    },
    mapSkillsForSkillFilter () {
      return Object.values(this.skills).map(skill => ({ label: skill.name, id: skill.id }))
    }
  }
}
</script>
