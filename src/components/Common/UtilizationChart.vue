<template>
  <div>
    <loading v-if="profileProjectsStatus !== 'success'" />
    <line-chart
      v-else
      :style="style"
      :chart-data="chartData"
      :options="chartOptions"
      class="UtilizationChart"
    />
  </div>
</template>

<script>
import merge from 'lodash/merge'
import { mapGetters } from 'vuex'
import LineChart from '@/components/Charts/LineChart'
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
      default: '#E3E2E8'
    },
    fillColor: {
      type: String,
      default: 'rgb(97, 176, 32)'
    },
    overrideOptions: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['profileProjectsStatus', 'projectById']),
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
      const options = {
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
                  month: 'MMM'
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
              gridLines: {
                display: false
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
      if (this.overrideOptions) {
        merge(options, this.overrideOptions)
      }
      return options
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
          if (!this.projectById(project.projectId).isInternal) {
            if (moment(project.startDate) <= date && (project.endDate == null || date < moment(project.endDate))) {
              values[index] += project.workPercentage
            }
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
