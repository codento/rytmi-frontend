<template>
  <chart-card class="mt-1">
    <template slot="header">
      <div class="h3 px-2">
        Utilization
      </div>
    </template>
    <b-col
      :cols="12"
      :md="12"
    >
      <p class="lead px-2">
        Consultants in project today: <strong>{{ utilized }}</strong><br>
        Consultants without project: <strong>{{ notUtilized }} </strong>
      </p>
    </b-col>
    <b-col
      :cols="12"
      :md="10"
      :offset-md="1"
    >
      <div class="pr-2">
        <line-chart
          :chart-data="lineChartData"
          :options="lineChartOptions"
        />
      </div>
    </b-col>
  </chart-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { isWithinRange, isBefore, isAfter, addMonths, addDays, format } from 'date-fns'
import ChartCard from './ChartCard'
import LineChart from '../Charts/LineChart'

export default {
  components: {
    ChartCard,
    LineChart
  },
  data () {
    return {
      today: Date.now(),
      endDate: addMonths(Date.now(), 6),
      utilized: 0,
      notUtilized: 0,
      chartTitleFontSize: '16',
      chartColor: 'rgb(66, 244, 92, 0.4)',
      chartBorderColor: 'rgb(66, 244, 92)'
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'futureProjectsOfProfile'
    ]),
    getProjects (id) {
      return this.futureProjectsOfProfile(id)
    },
    lineChartData () {
      const utilization = this.mapUtilizationOnTimeFrame(this.today, this.endDate)
      return {
        labels: utilization.labels,
        datasets: [
          {
            data: utilization.data,
            backgroundColor: this.chartColor,
            borderColor: this.chartBorderColor
          }
        ]
      }
    },
    lineChartOptions () {
      return {
        title: {
          display: true,
          fontSize: this.chartTitleFontSize,
          text: 'Number of consultants in project'
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
                suggestedMax: Object.keys(this.profileFilter()).length
              }
            }
          ]
        }
      }
    }
  },
  created () {
    Object.keys(this.profileFilter()).forEach((profile) => {
      const projectProfiles = this.futureProjectsOfProfile(profile)
      this.consultantHasProjectOnDate(projectProfiles, this.today)
        ? this.utilized += 1
        : this.notUtilized += 1
    })
  },
  methods: {
    consultantHasProjectOnDate (projectProfiles, date) {
      projectProfiles.sort((a, b) => {
        if (isBefore(a.startDate, b.startDate)) {
          return -1
        }
        if (isAfter(a.startDate, b.startDate)) {
          return 1
        }
        return 0
      })
      if (projectProfiles.length > 0) {
        if (isWithinRange(date, projectProfiles[0].startDate, projectProfiles[0].endDate)) {
          return true
        } else {
          return false
        }
      }
      return false
    },
    mapUtilizationOnTimeFrame (start, end) {
      let idx = 0
      const utilization = []
      const labels = []
      let currentDate = start
      const profiles = Object.keys(this.profileFilter())
      while (isBefore(currentDate, end)) {
        utilization.push(0)
        profiles.forEach(profile => {
          const profileProjects = this.futureProjectsOfProfile(profile)
          if (this.consultantHasProjectOnDate(profileProjects, currentDate)) {
            utilization[idx] += 1
          }
        })
        idx += 1
        labels.push(format(currentDate, 'DD/MM/YYYY'))
        currentDate = addDays(currentDate, 7)
      }
      return { data: utilization, labels }
    }
  }
}
</script>
