<template>
  <chart-card>
    <template slot="header">
      <h2>Utilization</h2>
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
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

const createLabel = (date) => format(date, 'D.M.YYYY')

export default {
  name: 'ConsultantUtilizationChart',
  components: {
    ChartCard,
    LineChart
  },
  props: {
    activeRoleSelection: Array
  },
  data () {
    return {
      today: new Date(),
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
      'futureProjectsOfProfile',
      'profileById',
      'projectById',
      'employerByName'
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
  watch: {
    activeRoleSelection: {
      handler: function (after, before) {
        this.countUtilizedActiveProfiles()
      },
      deep: true
    }
  },
  created () {
    const profiles = this.profileFilter()
    this.activeProfiles = Object.keys(profiles).map((key) => profiles[key].id)
    this.countUtilizedActiveProfiles()
  },
  beforeUpdate () {
    this.countUtilizedActiveProfiles()
  },
  methods: {
    countUtilizedActiveProfiles () {
      this.utilized = 0
      this.notUtilized = 0
      const consultantProfiles = this.activeProfiles.filter(profile => {
        return this.activeRoleSelection.some(role => {
          return this.profileById(profile).employeeRoles.includes(role.id)
        })
      })
      consultantProfiles.forEach((profile) => {
        const projectProfiles = this.futureProjectsOfProfile(profile).filter(profileProject =>
          this.projectById(profileProject.projectId).employerId === this.employerByName(INTERNAL_COMPANY_NAME).id &&
          !this.projectById(profileProject.projectId).isInternal)
        this.consultantHasOngoingProject(projectProfiles, this.today)
          ? this.utilized += 1
          : this.notUtilized += 1
      })
    },
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
        if (this.activeRoleSelection.some(role => this.profileById(profile).employeeRoles.includes(role.id))) {
          const profileProjects = this.futureProjectsOfProfile(profile).filter(profileProject =>
            this.projectById(profileProject.projectId).employerId === this.employerByName(INTERNAL_COMPANY_NAME).id &&
            !this.projectById(profileProject.projectId).isInternal)
          if (this.consultantHasOngoingProject(profileProjects, currentDate)) {
            count += 1
          }
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
