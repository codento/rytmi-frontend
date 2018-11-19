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
        <select-filter
          :selected="selectedSkills"
          :options="selectFilterOptions"
          heading="Skills"
          @item-clicked="filterChanged"
        />
      </div>
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

export default {
  components: {
    ChartCard,
    RadarChart,
    BarChart,
    SkillExplanations,
    SelectFilter
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
      return this.selectedSkills.map((skillId) => this.skills[skillId].name)
    },
    selectFilterOptions () {
      const options = Object.keys(this.skills).map((key) => (
        { text: this.skills[key].name, value: this.skills[key].id }
      ))
      options.sort((a, b) => {
        const aIncluded = this.selectedSkills.includes(a.value)
        const bIncluded = this.selectedSkills.includes(b.value)
        if (aIncluded === bIncluded) {
          return 0
        }
        return aIncluded ? -1 : 1
      })
      return options
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
      const proficiencyAverages = this.selectedSkills.map((skillId) => this.skillInfo[skillId].proficiencyAverage)
      const willingnessAverages = this.selectedSkills.map((skillId) => this.skillInfo[skillId].willingnessAverage)
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
      return this.selectedSkills.map(skillId => this.skillInfo[skillId].proficiencies.length)
    },
    filterChanged (val) {
      if (this.selectedSkills.includes(val)) {
        this.selectedSkills = this.selectedSkills.filter((skillId) => val !== skillId)
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
      this.selectedSkills = skillIds.slice(0, 3).map(id => Number(id))
    }
  }
}
</script>
