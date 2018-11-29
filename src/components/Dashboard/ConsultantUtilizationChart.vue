<template>
  <chart-card>
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
      :md="12"
    >
      <line-chart
        :chart-data="lineChartData"
        :options="lineChartOptions"
      />
    </b-col>
  </chart-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { isWithinRange, isBefore, isAfter, addMonths, addWeeks, format } from 'date-fns'
import ChartCard from './ChartCard'
import LineChart from '../Charts/LineChart'

const createLabel = (date) => format(date, 'DD/MM/YYYY')
const sortByDate = (dateOne, dateTwo) => {
  if (isBefore(dateOne, dateTwo)) {
    return -1
  }
  if (isAfter(dateOne, dateTwo)) {
    return 1
  }
  return 0
}

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
      activeProfiles: [],
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
        responsive: true,
        maintainAspectRatio: false,
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
    this.activeProfiles = Object.keys(this.profileFilter())
    this.activeProfiles.forEach((profile) => {
      const projectProfiles = this.futureProjectsOfProfile(profile)
      this.consultantHasProjectOnDate(projectProfiles, this.today)
        ? this.utilized += 1
        : this.notUtilized += 1
    })
  },
  methods: {
    consultantHasProjectOnDate (projectProfiles, date) {
      projectProfiles.sort((a, b) => sortByDate(a.startDate, b.startDate))
      if (projectProfiles.length > 0) {
        return isWithinRange(date, projectProfiles[0].startDate, projectProfiles[0].endDate)
      }
      return false
    },
    countUtilizedConsultantsOnDate (currentDate) {
      let count = 0
      this.activeProfiles.forEach(profile => {
        const profileProjects = this.futureProjectsOfProfile(profile)
        if (this.consultantHasProjectOnDate(profileProjects, currentDate)) {
          count += 1
        }
      })
      return count
    },
    mapUtilizationOnTimeFrame (startDate, endDate) {
      const utilization = []
      const labels = []
      let currentDate = startDate
      for (let i = 0; isBefore(currentDate, endDate); i += 1) {
        utilization.push(this.countUtilizedConsultantsOnDate(currentDate))
        currentDate = addWeeks(currentDate, 1)
        labels.push(createLabel(currentDate))
      }
      return { data: utilization, labels }
    }
  }
}
</script>
