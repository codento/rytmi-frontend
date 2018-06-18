<template>
  <div>
    <loading v-if="profileProjectsStatus !== 'loading'"></loading>
    <line-chart v-else class="utilizationChart" :style="style" :chartData="utilization" :options="options"></line-chart>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../Charts/LineChart'

export default {
  name: 'UtilizationChart',
  props: {
    projects: Array,
    height: {
      type: String,
      default: '75px'
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
      return new Date()
    },
    maxDate () {
      return new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 6))
    },
    style () {
      return `height: ${this.height};`
    },
    options () {
      return {
        chartArea: {
          backgroundColor: 'rgba(251, 85, 85, 0.4)'
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
    utilization () {
      const minDate = this.minDate
      const maxDate = this.maxDate
      let dates = new Set([minDate])

      function addDate (date) {
        if (minDate < date && date < maxDate) {
          dates.add(date)
        }
      }

      this.projects.forEach(project => {
        addDate(new Date(project.startDate))
        const end = new Date(project.endDate)
        end.setDate(end.getDate() + 1)
        addDate(end)
      })
      const sortetDates = Array.from(dates).sort((a, b) => {
        return a - b
      })
      let values = new Array(dates.size).fill(0)

      sortetDates.map((date, index) => {
        this.projects.forEach(project => {
          if (new Date(project.startDate) <= date && date < new Date(project.endDate)) {
            values[index] += project.workPercentage
          }
        })
      })
      sortetDates.push(maxDate)
      values.push(values[values.length - 1])

      return {
        labels: sortetDates,
        datasets: [{
          label: 'Utilization',
          backgroundColor: 'rgb(141, 193, 95)',
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
