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
import { isWithinRange, isBefore, addMonths, addWeeks, format, isAfter } from 'date-fns'
import ChartCard from './ChartCard'
import LineChart from '../Charts/LineChart'

const createLabel = (date) => format(date, 'DD/MM/YYYY')

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
    const profiles = this.profileFilter()
    this.activeProfiles = Object.keys(profiles).map((key) => profiles[key].id)
    this.activeProfiles.forEach((profile) => {
      const projectProfiles = this.futureProjectsOfProfile(profile)
      this.consultantHasOngoingProject(projectProfiles, this.today)
        ? this.utilized += 1
        : this.notUtilized += 1
    })
  },
  methods: {
    consultantHasOngoingProject (projectProfiles, date) {
      if (projectProfiles.length > 0) {
        const onGoingProjects = projectProfiles.filter(
          pp => (pp.endDate ? isWithinRange(date, pp.startDate, pp.endDate) : isAfter(date, pp.startDate))
        )
        return onGoingProjects.length > 0
      }
      return false
    },
    countUtilizedConsultantsOnDate (currentDate) {
      let count = 0
      this.activeProfiles.forEach(profile => {
        const profileProjects = this.futureProjectsOfProfile(profile)
        if (this.consultantHasOngoingProject(profileProjects, currentDate)) {
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
        labels.push(createLabel(currentDate))
        currentDate = addWeeks(currentDate, 1)
      }
      return { data: utilization, labels }
    }
  }
}
</script>
