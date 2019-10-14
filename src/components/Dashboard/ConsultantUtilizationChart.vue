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
        Consultants in project today: <strong>{{ utilizationToday.utilized }}</strong><br>
        Consultants without project: <strong>{{ utilizationToday.notUtilized }} </strong>
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
import { isWithinRange, isBefore, addWeeks, addMonths, isAfter } from 'date-fns'
import ChartCard from './ChartCard'
import LineChart from '../Charts/LineChart'
import { INTERNAL_COMPANY_NAME, COLORS } from '@/utils/constants'

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
      chartTitleFontSize: '16',
      defaultOptions: {
        pointRadius: 0,
        pointHoverBorderWidth: 4,
        pointHitRadius: 10,
        lineTension: 0.1
      },
      optionsForRole: {
        1: {
          label: 'Software developers',
          baseColor: COLORS.violet,
          pointHoverBorderColor: COLORS.violet
        },
        2: {
          label: 'Method coaches',
          baseColor: COLORS.orange,
          pointHoverBorderColor: COLORS.orange
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'futureProjectsOfProfile',
      'projectById',
      'employerByName',
      'profileEmployersByProfileId',
      'employerById',
      'absencesByProfileId',
      'absences',
      'leaveById'
    ]),
    selectedProfiles () {
      return this.profileFilter().filter(profile => {
        return this.activeRoleSelection.some(role => {
          return profile.employeeRoles.includes(role.id)
        })
      })
    },
    profileRolesCount () {
      const count = {}
      this.selectedProfiles.forEach(profile => {
        const roleKey = profile.employeeRoles.length === 1 ? profile.employeeRoles[0] : 'multipleRoles'
        if (count[roleKey]) {
          count[roleKey] += 1
        } else {
          count[roleKey] = 1
        }
      })
      return count
    },
    utilizationToday () {
      let utilized = 0
      let notUtilized = 0
      this.activeRoleSelection.forEach(role => {
        const utilization = this.countUtilizedConsultantsOnDate(this.today, role.id)
        utilized += utilization.utilized
        notUtilized += utilization.notUtilized
      })

      // Handle employees with multiple roles
      if (this.profileRolesCount.hasOwnProperty('multipleRoles')) {
        this.selectedProfiles.filter(profile => profile.employeeRoles.length > 1).forEach(profile => {
          // Remove duplicates from counts
          this.consultantHasOngoingProject(profile.id, this.today)
            ? utilized -= 1
            : notUtilized -= 1
        })
      }
      return { utilized, notUtilized }
    },
    lineChartData () {
      const datasets = []
      const rolesSortedByCount = [...this.activeRoleSelection].sort((a, b) => this.profileRolesCount[a.id] - this.profileRolesCount[b.id])

      let datasetCount = 0
      rolesSortedByCount.forEach(role => {
        if (this.profileRolesCount[role.id]) {
          const utilization = this.mapUtilizationOnTimeFrame(this.today, this.endDate, role.id)
          const options = this.optionsForRole[role.id]
          // Add datasets describing maximum capacity to the end of datasets
          datasets.push(
            {
              ...this.defaultOptions,
              data: this.fullCapacity(this.today, this.endDate, role.id),
              label: 'Maximum for ' + (options.label || role.title).toLowerCase(),
              backgroundColor: 'rgb(255, 255, 255)', // For legend only as fill=false
              fill: false,
              borderDash: [5, 5],
              borderColor: `rgb(${options.baseColor}, 0.8)` || 'rgb(66, 244, 92)'
            }
          )
          const colorFactor = ((datasetCount + 1) * 0.1)
          const lightenColor = (rgbColorString, factor) => {
            return rgbColorString.split(',').map(value => parseInt(value.trim()) + factor * 255).join(',')
          }
          // Add utilized count before free capacity datasets
          datasets.splice(datasetCount, 0, {
            ...this.defaultOptions,
            data: utilization.utilized,
            label: options.label || role.title,
            backgroundColor: `rgb(${lightenColor(options.baseColor, colorFactor)}, ${0.7 - colorFactor})` || 'rgb(66, 244, 92, 0.4)',
            borderColor: `rgb(${options.baseColor})` || 'rgb(66, 244, 92)'
          })
          datasetCount++
        }
      })
      return { datasets }
    },
    lineChartOptions () {
      return {
        title: {
          display: true,
          fontSize: this.chartTitleFontSize,
          text: 'Number of consultants in projects'
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
                suggestedMax: Math.max(...Object.values(this.profileRolesCount)) + 2,
                stepSize: Math.ceil(Math.max(...Object.values(this.profileRolesCount)) / 10)
              }
            }
          ],
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'month'
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    countUtilizedConsultantsOnDate (date, roleId) {
      let utilized = 0
      let notUtilized = 0
      let total = 0

      this.selectedProfiles.filter(profile => profile.employeeRoles.includes(roleId)).forEach((profile) => {
        if (this.isAvailableOnDate(profile.id, date)) { total += 1 }
        this.consultantHasOngoingProject(profile.id, date)
          ? utilized += 1
          : notUtilized += 1
      })
      return { utilized, notUtilized, total }
    },
    consultantHasOngoingProject (profileId, date) {
      const projectProfiles = this.getProfileProjects(profileId)
      if (projectProfiles.length > 0) {
        const onGoingProjects = projectProfiles.filter(
          pp => (pp.endDate ? isWithinRange(date, pp.startDate, pp.endDate) : isAfter(date, pp.startDate))
        )
        return onGoingProjects.length > 0
      }
      return false
    },
    getProfileProjects (profileId) {
      return this.futureProjectsOfProfile(profileId).filter(profileProject => {
        const project = this.projectById(profileProject.projectId)
        return project.employerId === this.employerByName(INTERNAL_COMPANY_NAME).id && !project.isInternal
      })
    },
    mapUtilizationOnTimeFrame (startDate, endDate, roleId) {
      const utilizationData = { utilized: [], notUtilized: [] }

      let currentDate = startDate

      for (let i = 0; isBefore(currentDate, endDate); i += 1) {
        utilizationData.utilized.push({
          x: new Date(currentDate),
          y: this.countUtilizedConsultantsOnDate(currentDate, roleId).utilized
        })
        currentDate = addWeeks(currentDate, 1)
      }
      return utilizationData
    },
    isAbsent (profileId, date) {
      return this.mapLeavesToAbsences() ? this.mapLeavesToAbsences().some(absence => (
        absence.profileId === profileId &&
        isWithinRange(date, absence.startDate, absence.endDate ? absence.endDate : new Date('2100-12-31')) &&
        absence.leave.affectsUtilisation)) : false
    },
    isAvailableOnDate (profileId, date) {
      const current = this.profileEmployersByProfileId(profileId)
        .filter(job => this.employerByName(INTERNAL_COMPANY_NAME).id === job.employerId)
      current.length > 0 || current.push({ startDate: new Date('1970-01-01'), endDate: new Date('2100-12-31') })
      const normalized = current.map(relation => {
        return {
          startDate: new Date(relation.startDate),
          endDate: relation.endDate
            ? new Date(relation.endDate)
            : new Date('2100-12-31') }
      })[0]
      return isWithinRange(date, normalized.startDate, normalized.endDate) && !this.isAbsent(profileId, date)
    },
    mapLeavesToAbsences () {
      return this.absences && Object.values(this.absences).map(absence => {
        return { ...absence, leave: this.leaveById(absence.leaveId) }
      })
    },
    fullCapacity (startDate, endDate, roleId) {
      const availabilityData = []
      let currentDate = startDate

      for (let i = 0; isBefore(currentDate, endDate); i += 1) {
        availabilityData.push(
          {
            x: new Date(currentDate),
            y: this.countUtilizedConsultantsOnDate(currentDate, roleId).total
          })
        currentDate = addWeeks(currentDate, 1)
      }

      return availabilityData
    }
  }
}
</script>
