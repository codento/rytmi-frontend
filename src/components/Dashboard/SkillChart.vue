<template>
  <chart-card>
    <template slot="header">
      <div class="h3 px-2">Skills <i
        id="skill-explanations-icon"
        class="cui-info"
      />
        <b-popover
          target="skill-explanations-icon"
          title="Skill level descriptions"
          triggers="hover focus"
        >
          <skill-explanations
            :know-desc="proficiencyDescriptions.knows"
            :want-desc="proficiencyDescriptions.wants"
          />
        </b-popover>
      </div>
      <b-col>
        <v-select
          v-model="selectedSkills"
          :options="unselectedSkills"
          multiple
        />
      </b-col>
    </template>
    <b-col
      cols="12"
      md="6"
    >
      <bar-chart
        :chart-data="barChartData"
        :options="barChartOptions"
      />
    </b-col>
    <b-col
      cols="12"
      md="6"
    >
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
import proficiencyDescriptions from '@/assets/proficiencyDesc'
import { sortBy } from 'lodash'
import vSelect from 'vue-select'

const colors = {
  skillLevelColor: 'rgb(253, 167, 8, 0.4)',
  skillLevelBorderColor: 'rgb(253, 167, 8)',
  willingnessColor: 'rgb(66, 244, 92, 0.4)',
  willingnessBorderColor: 'rgb(66, 244, 92)',
  barChartColors: ['#ff3333', '#ff9234', '#ffcd3c', '#fefed5', '#35d0ba']
}

const mapColorsForDatasets = (labels, colors) => {
  let i = 0
  const dataSetColors = labels.map(label => {
    const color = colors[i]
    i++
    if (i >= colors.length) {
      i = 0
    }
    return color
  })
  return dataSetColors
}

const chartTitleFontSize = '16'

export default {
  components: {
    ChartCard,
    RadarChart,
    BarChart,
    SkillExplanations,
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
      proficiencyDescriptions
    }
  },
  computed: {
    skillsLength () {
      return Object.keys(this.skills).length
    },
    skillLabels () {
      return this.selectedSkills.map(skill => skill.label)
    },
    unselectedSkills () {
      const skills = Object.values(this.skills)
      const selectedSkillIds = this.selectedSkills.map(s => s.id)
      const unselectedSkills = sortBy(skills.filter(skill => !selectedSkillIds.includes(skill.id)), 'name')
      return this.formatForVueSelect(unselectedSkills)
    },
    numberOfPeopleWithSelectedSkills () {
      return this.selectedSkills.map(skill => this.skillInfo[skill.id].proficiencies.length)
    },
    barChartData () {
      return {
        labels: this.skillLabels,
        datasets: [
          {
            data: this.numberOfPeopleWithSelectedSkills,
            backgroundColor: mapColorsForDatasets(this.skillLabels, colors.barChartColors)
          }
        ]
      }
    },
    barChartOptions () {
      return {
        title: {
          display: true,
          fontSize: chartTitleFontSize,
          text: 'Number of consultants with given skill'
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
                suggestedMax: this.profileList.length / 2
              }
            }
          ]
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
            backgroundColor: colors.skillLevelColor,
            borderColor: colors.skillLevelBorderColor,
            data: proficiencyAverages
          },
          {
            label: 'Willingness to work with',
            backgroundColor: colors.willingnessColor,
            borderColor: colors.willingnessBorderColor,
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
          fontSize: chartTitleFontSize
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
    this.pickThreeMostKnownSkills(this.skillInfo)
  },
  methods: {
    pickThreeMostKnownSkills (skillInfo) {
      const skillIds = Object.keys(skillInfo)
      skillIds.sort((a, b) => skillInfo[b].proficiencies.length - skillInfo[a].proficiencies.length)
      const top3Skills = skillIds.slice(0, 3).map(id => Number(id)).map(id => this.skills[id])
      this.selectedSkills = this.formatForVueSelect(top3Skills)
    },
    formatForVueSelect (skills) {
      return skills.map(skill => ({ label: skill.name, id: skill.id }))
    }
  }
}
</script>
