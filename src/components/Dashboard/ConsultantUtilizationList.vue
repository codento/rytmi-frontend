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
          :id="'thumbnail-' + item.profile.id"
          v-bind="imgProps"
          thumbnail
          fluid
          :src="imageUrl[item.profile.id]"
          :blank="!imageUrl[item.profile.id] || false"
          class="thumbnail"
          rounded="circle"
          @error="handleBrokenImg(item.profile.id)"
        />
        <span :class="`${item.profileRoleClass} profile-tag-name px-2`"> {{ item.profile.firstName }} {{ item.profile.lastName }} </span>
      </div>
    </b-col>
    <b-col
      cols="12"
      class="mx-2 my-4"
    >
      <h3>In projects</h3>
      <!-- Month labels -->
      <b-row class="mx-3 text-center">
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col :cols="currentDayNumber > 20 ? 1 : 2" />
        <b-col
          v-for="(month, labelIndex) in Object.values(monthData)"
          :key="'month-label-' + labelIndex"
        >
          {{ month.label }}
        </b-col>
      </b-row>
      <!-- Progress bars -->
      <b-row
        v-for="item in utilizedEmployees"
        :key="item.profile.id"
        class="mx-3"
      >
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col
          :cols="currentDayNumber > 20 ? 1 : 2"
          class="profile-tag-col pt-0"
        >
          <div
            class="profile-tag mx-2"
            @click="openProfile(item.profile)"
          >
            <b-img
              :id="'thumbnail-' + item.profile.id"
              v-bind="imgProps"
              thumbnail
              fluid
              :src="imageUrl[item.profile.id]"
              :blank="!imageUrl[item.profile.id] || false"
              class="thumbnail"
              rounded="circle"
              @error="handleBrokenImg(item.profile.id)"
            />
            <span :class="`${item.profileRoleClass} profile-tag-name px-2`"> {{ item.profile.firstName }} {{ item.profile.lastName }} </span>
          </div>
        </b-col>
        <b-col
          v-for="(progressBarData, monthIndex) in getProgressBarValues(item.daysToProjectStart, item.daysToZeroUtilization, item.utilization)"
          :key="'month-' + monthIndex"
          :class="monthIndex < monthData.length - 1 ? 'utilization-bar px-0 border-right' : 'utilization-bar px-0'"
        >
          <b-progress
            class="mt-4 project-progress"
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
            v-show="progressBarData.showEndLabel && item.endsOn"
            :class="`float-${getDateLabelPositionAndFormat(item.endsOn).position} project-progress px-2`"
          >
            Ends on {{ getDateLabelPositionAndFormat(item.endsOn).label }}
          </span>
          <span
            v-show="progressBarData.showStartLabel"
            :class="`float-${getDateLabelPositionAndFormat(item.startsOn).position} project-progress px-2`"
          >
            Starts on {{ getDateLabelPositionAndFormat(item.startsOn).label }}
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

const getMinDate = (projectsArray) => {
  const projectsStartDates = projectsArray.map(project => new Date(project.startDate))
  return new Date(Math.min.apply(null, projectsStartDates))
}

export default {
  name: 'ConsultantUtilizationList',
  components: {
    ChartCard
  },
  props: {
    activeRoleSelection: Array
  },
  data () {
    return {
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthsDisplayed: 4,
      imgProps: { width: 50, height: 50, class: 'm1' },
      imageUrl: {}
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'profileFilter',
      'futureProjectsOfProfile',
      'projectById',
      'employerByName'
    ]),
    selectedProfiles () {
      return this.profileFilter().filter(profile => {
        return this.activeRoleSelection.some(role => {
          return profile.employeeRoles.includes(role.id)
        })
      })
    },
    currentDayNumber () {
      return new Date(Date.now()).getDate()
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
        return { month: thisMonth, label: this.monthNames[thisMonth], days: getDaysInMonth(new Date(thisYear, thisMonth)) }
      })
    },
    orderedProfiles () {
      // Filter out profiles having only administrative role
      const mappedObjects = this.mapProjectsToProfiles().filter(item => item.profile.employeeRoles.every(i => [1, 2].includes(i)))
      return mappedObjects.sort((a, b) => {
        // If project start date is more than 30 days in the future, sort to top
        const sortValue = a.daysToProjectStart > 30 ? 0 : a.daysToZeroUtilization
        const compareValue = b.daysToProjectStart > 30 ? 0 : b.daysToZeroUtilization
        return sortValue - compareValue
      })
    },
    freeEmployees () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization === 0)
    },
    utilizedEmployees () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization > 0)
    }
  },
  created () {
    Object.values(this.profiles).forEach(profile => {
      this.$set(this.imageUrl, profile.id, profile.photoPath)
    })
  },
  methods: {
    getDateLabelPositionAndFormat (date) {
      if (date) {
        if (differenceInDays(date, new Date()) > this.monthsDisplayed * 31 || !this.monthData.map(item => item.month).includes(date.getMonth())) {
          return { label: format(date, 'MM/YYYY'), position: 'right' }
        }
        return { label: format(date, 'D/M'), position: date.getDate() < 10 ? 'left' : 'right' }
      }
      return { label: '', position: 'right' }
    },
    mapProjectsToProfiles () {
      // Map projects for each active profile
      return this.selectedProfiles.map(profile => {
        const projects = this.futureProjectsOfProfile(profile.id).map(profileProject => {
          const project = this.projectById(profileProject.projectId)
          return { ...project, ...profileProject }
        }).filter(combinedProject =>
          !combinedProject.isInternal &&
          combinedProject.employerId === this.employerByName(INTERNAL_COMPANY_NAME).id)

        let daysToZeroUtilization = 0
        let daysToProjectStart = 0
        let startsOn, endsOn
        if (projects.length > 0) {
          // Handle projects without end date
          endsOn = getMaxDate(projects)
          daysToZeroUtilization = endsOn ? differenceInDays(endsOn.setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0)) : 100000

          startsOn = getMinDate(projects)
          daysToProjectStart = differenceInDays(startsOn.setHours(0, 0, 0, 0), new Date().setHours(0, 0, 0, 0))
        }
        return {
          profile,
          profileRoleClass: profile.employeeRoles.length === 1 ? 'role-' + profile.employeeRoles[0] : 'combined-role',
          utilization: this.calculateUtilization(projects),
          daysToZeroUtilization,
          daysToProjectStart,
          startsOn,
          endsOn
        }
      })
    },
    calculateUtilization (projects) {
      const todaysDate = new Date().setHours(0, 0, 0, 0)
      const utilizations = []

      // Array of unique start and end dates
      const uniqueStartAndEndDates = new Set([
        ...projects.map(project => new Date(project.startDate).setHours(0, 0, 0, 0)),
        ...projects.map(project => addDays(new Date(project.endDate || addMonths(todaysDate, this.monthsDisplayed)).setHours(0, 0, 0, 0), 1))
      ])
      // Filter dates in the past from the array and sort it
      const dateSteps = Array.from(uniqueStartAndEndDates).filter(date => date > todaysDate).sort((a, b) => a - b)
      let utilizationOnPreviousStep
      // Start iteration with todays date
      for (const date of [todaysDate, ...dateSteps]) {
        let utilizationOnCurrentStep = 0
        // Calculate combined utilization using ongoing projects at current step
        projects.filter(project => {
          const endDate = new Date(project.endDate || addMonths(todaysDate, this.monthsDisplayed))
          return new Date(project.startDate) <= date && endDate >= date
        })
          .forEach(project => {
            utilizationOnCurrentStep += project.workPercentage
          })

        if (utilizationOnPreviousStep !== utilizationOnCurrentStep) {
          utilizations.push({
            startDay: differenceInDays(date, todaysDate) - 1 > 0 ? differenceInDays(date, todaysDate) - 1 : 0,
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
    getProgressBarValues (daysToProjectStart, daysToZeroUtilization, utilizations) {
      let accumulatedDays = 0
      let startLabelPlaced = false
      return Object.values(this.monthData).map((month, monthIndex) => {
        // Handle first month: remove number of days already passed
        const numberOfDaysInMonth = monthIndex === 0 ? month.days - this.currentDayNumber : month.days

        const currentMonthsUtilizations = utilizations.filter(utilization => utilization.startDay < accumulatedDays + numberOfDaysInMonth && utilization.endDay >= accumulatedDays)
        const progressBar = { values: [], showEndLabel: false, showStartLabel: false, utilization: 0 }

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
          // Show start date label on the first project only
          if (daysToProjectStart > 0 && utilization.value > 0 && !startLabelPlaced) {
            progressBar.showStartLabel = true
            startLabelPlaced = true
          }
        })
        // Logic for displaying labels (displayd only once)
        // If project continues next month
        if (daysToZeroUtilization - accumulatedDays > numberOfDaysInMonth) {
          // Show label for last month in display
          if (monthIndex === this.monthData.length - 1) {
            progressBar.showEndLabel = daysToProjectStart < accumulatedDays + numberOfDaysInMonth
            // Show start label only if start date is in the future
            progressBar.showStartLabel = !startLabelPlaced && daysToProjectStart === 0
          }
        // If project ends this month
        } else if (daysToZeroUtilization - accumulatedDays > 0) {
          progressBar.showEndLabel = true
        }
        accumulatedDays += numberOfDaysInMonth
        return progressBar
      })
    },
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    },
    handleBrokenImg (profileId) {
      this.$set(this.imageUrl, profileId, null)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.img {
  min-height: 50px;
}
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
.progress {
  background-color: darken(white, 5%);
}
.progress-bar {
  background-color: $c-violet;
}
.role-1 {
  background: $c-violet;
}
.role-2 {
  background: $c-orange
}
.combined-role {
  background: repeating-linear-gradient(
    45deg,
    $c-violet,
    $c-violet 50px,
    $c-orange 50px,
    $c-orange 200px
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
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 1px;
}
.hide-progress {
  background-color: white;
}
</style>
