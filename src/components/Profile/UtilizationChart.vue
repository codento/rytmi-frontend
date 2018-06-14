<template>
  <div>
     <line-chart class="utilizationChart" :data="utilization" :options="options"></line-chart>
  </div>
</template>

<script>
import LineChart from '../Charts/LineChart'

export default {
  name: 'UtilizationChart',
  props: {
    projects: Array
  },
  data () {
    return {}
  },
  components: {
    LineChart
  },
  computed: {
    minDate () {
      return new Date()
    },
    maxDate () {
      return new Date(new Date(this.minDate).setMonth(this.minDate.getMonth() + 6))
    },
    options () {
      return {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              max: this.maxDate,
              displayFormats: {
                month: 'MM'
              }
            },
            display: false
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
        addDate(new Date(end.setDate(end.getDate() + 1)))
      })
      const sortetDates = Array.from(dates).sort((a, b) => {
        return a - b
      })
      let values = new Array(dates.size).fill(0)

      sortetDates.map((date, index) => {
        this.projects.forEach(project => {
          if (new Date(project.startDate) <= date && date < new Date(project.endDate)) {
            console.log('\tno')
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
          borderColor: 'rgb(0, 0, 0)',
          borderWidth: 1,
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
    height: 75px;
    border: solid black 1px;
    background-color: rgb(182, 71, 113);
  }
</style>
