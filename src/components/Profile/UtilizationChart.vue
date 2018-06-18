<template>
  <div>
    <loading v-if="profileProjectsStatus !== 'loading'"></loading>
    <line-chart v-else class="utilizationChart" :style="style" :chartData="chartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../Charts/LineChart'
import moment from 'moment'

export default {
  name: 'UtilizationChart',
  props: {
    projects: Array,
    height: {
      type: String,
      default: '75px'
    },
    backgroundColor: {
      type: String,
      default: 'rgba(251, 85, 85, 0.4)'
    },
    fillColor: {
      type: String,
      default: 'rgb(97, 176, 32)'
    }
  },
  data () {
    return {}
  },
  components: {
    LineChart
  },
  computed: {
    ...mapGetters([
      'profileProjectsStatus'
    ]),
    minDate () {
      return moment()
    },
    maxDate () {
      return this.minDate.clone().add(6, 'months')
    },
    style () {
      return `height: ${this.height};`
    },
    chartOptions () {
      return {
        chartArea: {
          backgroundColor: this.backgroundColor
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              max: this.maxDate,
              unit: 'month',
              stepSize: 1,
              tooltipFormat: 'D.M.YY'
            },
            gridLines: {
              display: true
            },
            ticks: {
              display: false
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              min: 0,
              max: 100
            },
            display: false
          }]
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    },
    chartData () {
      const dates = new Set([this.minDate])
      const self = this
      function addDate (date) {
        if (self.minDate < date && date < self.maxDate) {
          dates.add(date)
        }
      }

      this.projects.forEach(project => {
        addDate(moment(project.startDate))
        addDate(moment(project.endDate).add(1, 'day'))
      })
      const sortetDates = Array.from(dates).sort((a, b) => {
        return a - b
      })

      const values = new Array(dates.size).fill(0)
      sortetDates.map((date, index) => {
        this.projects.forEach(project => {
          if (moment(project.startDate) <= date && date < moment(project.endDate)) {
            values[index] += project.workPercentage
          }
        })
      })

      sortetDates.push(this.maxDate)
      values.push(values[values.length - 1])

      return {
        labels: sortetDates,
        datasets: [{
          label: 'Utilization',
          backgroundColor: this.fillColor,
          steppedLine: true,
          data: values
        }]
      }
    }
  }
}
</script>

<style scoped>
  .utilizationChart {
    position: relative;
  }
</style>
