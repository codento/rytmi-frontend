<template>
  <div>
    <loading v-if="profileProjectsStatus !== 'success'" />
    <line-chart
      v-else
      :style="style"
      :chart-data="chartData"
      :options="chartOptions"
      class="utilizationChart"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineChart from '../Charts/LineChart'
import moment from 'moment'

export default {
  name: 'UtilizationChart',
  components: {
    LineChart
  },
  props: {
    projects: Array,
    height: {
      type: String,
      default: '90px'
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
  computed: {
    ...mapGetters(['profileProjectsStatus']),
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
          xAxes: [
            {
              type: 'time',
              time: {
                max: this.maxDate,
                displayFormats: {
                  month: 'M'
                },
                unit: 'month',
                stepSize: 1,
                tooltipFormat: 'D.M.YY'
              },
              gridLines: {
                display: true
              },
              ticks: {
                display: true
              }
            }
          ],
          yAxes: [
            {
              type: 'linear',
              ticks: {
                min: 0,
                max: 100,
                callback: (value) => {
                  if (value === 0 || value === 100) {
                    return `${value} %`
                  }
                }
              },
              display: true
            }
          ]
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
      const sortedDates = Array.from(dates).sort((a, b) => {
        return a - b
      })

      const values = new Array(dates.size).fill(0)
      sortedDates.map((date, index) => {
        this.projects.forEach(project => {
          if (moment(project.startDate) <= date && (project.endDate == null || date < moment(project.endDate))) {
            values[index] += project.workPercentage
          }
        })
      })

      sortedDates.push(this.maxDate)
      values.push(values[values.length - 1])

      return {
        labels: sortedDates,
        datasets: [
          {
            label: 'Utilization',
            backgroundColor: this.fillColor,
            steppedLine: true,
            data: values
          }
        ]
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
