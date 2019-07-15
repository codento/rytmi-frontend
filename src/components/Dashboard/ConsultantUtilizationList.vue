<template>
  <ChartCard>
    <template slot="header">
      <h2>Consultants</h2>
    </template>
    <b-col
      cols="12"
      class="mx-2 my-4"
    >
      <h3>Free capacity</h3>
      <div
        v-for="item in freeEmployees"
        :key="item.profile.id"
        class="profile-tag mx-2"
        @click="openProfile(item.profile)"
      >
        <b-img
          v-bind="imgProps"
          thumbnail
          fluid
          :src="item.profile.photoPath"
          class="thumbnail"
          rounded="circle"
          alt="Image 1"
        />
        <span :class="`${item.profileRoleClass} profile-tag-name px-2`"> {{ item.profile.firstName }} {{ item.profile.lastName }} </span>
      </div>
    </b-col>
    <b-col
      cols="12"
      class="mx-2 my-4"
    >
      <h3>Project ending soon</h3>
      <!-- Month labels -->
      <b-row class="mx-3 text-center">
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col :cols="currentDayNumber > 15 ? 1 : 2" />
        <b-col
          v-for="(month, labelIndex) in Object.values(monthData)"
          :key="'month-label-' + labelIndex"
        >
          {{ month.label }}
        </b-col>
      </b-row>
      <!-- Progress bars -->
      <b-row
        v-for="item in soonToBeFreeEmployees"
        :key="item.profile.id"
        class="mx-3"
      >
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col
          :cols="currentDayNumber > 15 ? 1 : 2"
          class="profile-tag-col pt-3"
        >
          <div
            class="profile-tag mx-2"
            @click="openProfile(item.profile)"
          >
            <b-img
              v-bind="imgProps"
              thumbnail
              fluid
              :src="item.profile.photoPath"
              class="thumbnail"
              rounded="circle"
              alt="Image 1"
            />
            <span :class="`${item.profileRoleClass} profile-tag-name px-2`"> {{ item.profile.firstName }} {{ item.profile.lastName }} </span>
          </div>
        </b-col>
        <b-col
          v-for="(progressBarData, monthIndex) in getProgressBarValues(item.daysToZeroUtilization, item.utilization)"
          :key="'month-' + monthIndex"
          :class="monthIndex < monthData.length - 1 ? 'utilization-bar px-0 border-right' : 'utilization-bar px-0'"
        >
          <b-progress
            class="mt-2 project-progress"
            :max="monthData[monthIndex].days"
          >
            <b-progress-bar
              v-show="monthIndex === 0"
              class="hide-progress"
              :value="currentDayNumber"
            />
            <b-progress-bar
              v-for="(progressBar, barIndex) in progressBarData.values"
              :id="`progress-${barIndex}-month-${monthIndex}-profile-${item.profile.id}`"
              :key="`progress-${barIndex}-month-${monthIndex}-profile-${item.profile.id}`"
              :value="progressBar.daysLeft"
              :style="progressBar.style"
            >
              <b-tooltip
                :target="`progress-${barIndex}-month-${monthIndex}-profile-${item.profile.id}`"
                :title="'Utilization: ' + progressBar.utilization + '%'"
              />
            </b-progress-bar>
          </b-progress>
          <span
            v-show="progressBarData.showLabel"
            class=" project-progress pr-2 float-right"
          >
            {{ item.finalDate }}
          </span>
        </b-col>
      </b-row>
    </b-col>
  </ChartCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { format, differenceInDays, addMonths, addDays, getDaysInMonth } from 'date-fns'
import ChartCard from './ChartCard'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

const getMaxDate = (projectsArray) => {
  const projectsEndDates = projectsArray.filter(project => !!project.endDate).map(project => new Date(project.endDate))
  return projectsEndDates.length > 0 ? new Date(Math.max.apply(null, projectsEndDates)) : undefined
}

export default {
  name: 'ConsultantUtilizationList',
  components: {
    ChartCard
  },
  props: {},
  data () {
    return {
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthsDisplayed: 4,
      imgProps: { blankColor: '#777', width: 50, height: 50, class: 'm1' }
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'futureProjectsOfProfile',
      'projectById',
      'employerByName',
      'currentLanguage'
    ]),
    currentDayNumber () {
      return new Date(Date.now()).getDate()
    },
    maximumDaysDisplayed () {
      return this.monthData.reduce((accumulator, month) => accumulator + month.days, 0)
    },
    monthData () {
      const indexes = []
      for (let i = 0; i < this.monthsDisplayed; i++) {
        indexes.push(i)
      }
      return indexes.map((arg, index) => {
        const dateOnIndex = addMonths(new Date(Date.now()), index)
        const thisMonth = dateOnIndex.getMonth()
        const thisYear = dateOnIndex.getYear()
        return { label: this.monthNames[thisMonth], days: getDaysInMonth(new Date(thisYear, thisMonth)) }
      })
    },
    orderedProfiles () {
      // Filter out profiles having only administrative role
      const mappedObjects = this.mapProjectsToProfiles().filter(item => item.profile.employeeRoles.every(i => [1, 2].includes(i)))
      return mappedObjects.sort((a, b) => a.utilization === 0 ? a.utilization - b.utilization : a.daysToZeroUtilization - b.daysToZeroUtilization)
    },
    freeEmployees () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization === 0)
    },
    soonToBeFreeEmployees () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization > 0 && item.daysToZeroUtilization < this.maximumDaysDisplayed + 30)
    }
  },
  methods: {
    formatDateLabel (date) {
      if (date) {
        if (differenceInDays(date, new Date()) > this.maximumDaysDisplayed) {
          return format(date, 'MM/YYYY')
        }
        return 'Ends on ' + format(date, 'D/M')
      }
      return 'End date not defined'
    },
    mapProjectsToProfiles () {
      const activeProfiles = this.profileFilter()
      // Map projects for each active profile
      return Object.values(activeProfiles).map(profile => {
        const projects = this.futureProjectsOfProfile(profile.id).map(profileProject => {
          const project = this.projectById(profileProject.projectId)
          return { ...project, ...profileProject }
        }).filter(combinedProject =>
          !combinedProject.isInternal &&
          combinedProject.employerId === this.employerByName(INTERNAL_COMPANY_NAME).id)

        let daysToZeroUtilization = 0
        let finalDate
        if (projects.length > 0) {
          // Handle projects without end date
          daysToZeroUtilization = getMaxDate(projects) ? differenceInDays(getMaxDate(projects).setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0)) : 100000
          finalDate = this.formatDateLabel(getMaxDate(projects))
        }

        return {
          profile: profile,
          profileRoleClass: profile.employeeRoles.length === 1 ? 'role-' + profile.employeeRoles[0] : 'combined-role',
          utilization: this.calculateUtilization(projects),
          daysToZeroUtilization: daysToZeroUtilization,
          finalDate
        }
      })
    },
    calculateUtilization (projects) {
      const todaysDate = new Date().setHours(0, 0, 0, 0)
      const utilizations = []
      // Array of unique start and end dates
      const uniqueStartAndEndDates = new Set([
        ...projects.map(project => new Date(project.startDate).setHours(0, 0, 0, 0)),
        ...projects.map(project => addDays(new Date(project.endDate).setHours(0, 0, 0, 0), 1))
      ])
      // Filter dates in the past from the array and sort it
      const dateSteps = Array.from(uniqueStartAndEndDates).filter(date => date > todaysDate).sort((a, b) => a - b)

      let utilizationOnPreviousStep
      // Start iteration with todays date
      for (const date of [todaysDate, ...dateSteps]) {
        let utilizationOnCurrentStep = 0
        // Calculate combined utilization using ongoing projects at current step
        projects.filter(project => {
          return new Date(project.startDate) <= date && new Date(project.endDate) >= date
        })
          .forEach(project => {
            utilizationOnCurrentStep += project.workPercentage
          })

        if (utilizationOnPreviousStep !== utilizationOnCurrentStep) {
          utilizations.push({
            startDay: differenceInDays(date, todaysDate),
            value: utilizationOnCurrentStep
          })

          if (utilizations.length > 1) {
            const currentIndex = utilizations.length - 1
            utilizations[currentIndex - 1].endDay = utilizations[currentIndex].startDay - 1
            utilizations[currentIndex - 1].numDays = utilizations[currentIndex - 1].endDay - utilizations[currentIndex - 1].startDay + 1
          }

          utilizationOnPreviousStep = utilizationOnCurrentStep
        }
      }
      return utilizations.slice(0, -1)
    },
    getProgressBarValues (daysToZeroUtilization, utilizations) {
      let accumulatedDays = 0
      return Object.values(this.monthData).map((month, monthIndex) => {
        // Handle first month: remove number of days already passed
        const numberOfDaysInMonth = monthIndex === 0 ? month.days - this.currentDayNumber : month.days

        const currentMonthsUtilizations = utilizations.filter(utilization => utilization.startDay < accumulatedDays + numberOfDaysInMonth && utilization.endDay >= accumulatedDays)
        const progressBar = { values: [], showLabel: false, utilization: 0 }

        currentMonthsUtilizations.forEach(utilization => {
          let numDays = utilization.numDays

          // Handle utilization changes on month start and end
          if (utilization.startDay < accumulatedDays) {
            numDays -= (accumulatedDays - utilization.startDay)
          }
          if (utilization.endDay > accumulatedDays + numberOfDaysInMonth) {
            numDays -= (utilization.endDay + 1 - (accumulatedDays + numberOfDaysInMonth))
          }
          progressBar.values.push({
            daysLeft: numDays,
            style: { opacity: (utilization.value) / 100 },
            utilization: utilization.value
          })
        })
        // Logic for displaying labels (displayd only once)
        if (daysToZeroUtilization - accumulatedDays > numberOfDaysInMonth) {
          // Show label for last item if not yet shown
          if (monthIndex === this.monthData.length - 1) {
            progressBar.showLabel = true
          }
        } else if (daysToZeroUtilization - accumulatedDays > 0) {
          progressBar.showLabel = true
        }
        accumulatedDays += numberOfDaysInMonth
        return progressBar
      })
    },
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.profile-tag-col {
  z-index: 10;
}
h3 {
  padding-bottom: 2em;
  &:after {
    content: "";
    display: block;
    width: auto;
    padding-top: 10px;
    border-bottom: 1px solid $c-light;

  }
}
.role-1 {
  background: $c-violet;
}
.role-2 {
  background: $c-pink;
}
.combined-role {
  background: repeating-linear-gradient(
    45deg,
    $c-violet,
    $c-violet 50px,
    $c-pink 50px,
    $c-pink 200px
  );
}
.profile-tag {
  float: left;
  white-space: nowrap;
  cursor: pointer;
  .profile-tag-name {
    color: white;
    font-family: 'Poppins';
    font-weight: 400;
    white-space: nowrap;
  }
  .profile-tag-name:hover {
    background: white;
    color: $c-violet-dark;
  }
  .thumbnail {
    position: relative;
    left: 5px;
  }
}
.project-progress {
  font-weight: 700;
  font-style: italic;
  letter-spacing: 1px;
}
.hide-progress {
  background-color: white;
}
.utilization-100 {
  background-color: $c-orange;
}
.utilization-80 {
  background-color: lighten($c-orange, 20%);
}
.utilization-60 {
  background-color: lighten($c-orange, 40%);
}
.utilization-20 {
  background-color: lighten($c-orange, 80%);
}
</style>
