<template>
  <ChartCard>
    <template slot="header">
      <h2>Leaves</h2>
    </template>
    <b-col
      cols="12"
      class="mx-2 my-4"
    >
      <b-form-group
        v-if="maximumMonthsOnScreen >= displayOptions[0].value"
        label="Number of months displayed"
        class="mb-4"
      >
        <b-form-radio-group
          id="leave-display-options"
          v-model="monthsDisplayed"
          :options="displayOptions.filter(option => option.value <= maximumMonthsOnScreen)"
        />
      </b-form-group>
      <b-row class="mx-3 text-center">
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col :cols="new Date(Date.now()).getDate() > 20 ? 1 : 2" />
        <b-col
          v-for="(month, labelIndex) in Object.values(monthData)"
          :key="'month-label-' + labelIndex"
        >
          {{ monthsDisplayed > 6 || maximumMonthsOnScreen === displayOptions[0].value ? month.label.substring(0, 3) : month.label }}
        </b-col>
      </b-row>
      <b-row
        v-for="item in profilesOnLeave"
        :key="item.id"
        class="mx-3 profile-utilization-row"
      >
        <!-- First column contains profile label, resize to 1 col after half month has passed -->
        <b-col
          :cols="new Date(Date.now()).getDate() > 20 ? 1 : 2"
          class="profile-tag-col pt-2"
        >
          <ProfileImageTag
            :profile-data="{ profile: item, profileRoleClass: item.profileRoleClass }"
            :image-props="imgProps"
            :image-url="item.photoPath"
          />
        </b-col>
        <b-col
          v-for="(progressBarData, monthIndex) in getProgressBarValues(new Date(), item.absences)"
          :key="'month-' + monthIndex"
          :class="monthIndex < monthData.length - 1 ? 'utilization-bar px-0 border-right' : 'utilization-bar px-0'"
        >
          <MonthProgessbar
            :progress-bar-data="progressBarData"
            :month-data="monthData"
            :month-index="monthIndex"
            :profile-data=" { ...item, profile: { id: item.id } }"
            :name="'leave'"
          />
        </b-col>
      </b-row>
    </b-col>
  </ChartCard>
</template>

<script>
import { mapGetters } from 'vuex'
import { isWithinRange, addMonths, addDays, getDaysInMonth, differenceInDays, format, isAfter, isBefore } from 'date-fns'
import ChartCard from './ChartCard'
import ProfileImageTag from '../Common/ProfileImageTag'
import MonthProgessbar from '../Common/MonthProgessbar'

export default {
  name: 'LeaveCalendar',
  components: {
    ChartCard,
    ProfileImageTag,
    MonthProgessbar
  },
  data () {
    return {
      windowWidth: 0,
      imgProps: { width: 50, height: 50, class: 'm1' },
      monthsDisplayed: 6,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      displayOptions: [
        { text: '3 months', value: 3, breakpoint: 0 },
        { text: '6 months', value: 6, breakpoint: 1000 },
        { text: '9 months', value: 9, breakpoint: 1200 },
        { text: '12 months', value: 12, breakpoint: 1600 }
      ]
    }
  },
  computed: {
    ...mapGetters(['profiles', 'leaveById']),
    lastDay () {
      return new Date(addMonths(new Date(), this.monthsDisplayed))
    },
    profilesOnLeave () {
      return Object.keys(this.profiles)
        .map(key => {
          return {
            ...this.profiles[key],
            profileRoleClass: this.profiles[key].employeeRoles.length === 1 ? 'role-' + this.profiles[key].employeeRoles[0] : 'combined-role'
          }
        })
        .filter(profile => profile.absences.some(absence => {
          return isWithinRange(absence.startDate, new Date(), this.lastDay) ||
            isWithinRange(absence.endDate, new Date(), this.lastDay) ||
            (isBefore(absence.startDate, new Date()) && isAfter(absence.endDate, this.lastDay))
        }))
    },
    absences () {
      const absences = Object.keys(this.profiles).map(key => {
        return this.profiles[key].absences.map(item => {
          return { ...item, name: `${this.profiles[key].firstName} ${this.profiles[key].lastName}` }
        })
      })
      return absences.filter(item => {
        return item.length > 0
      })
    },
    monthData () {
      const indexes = []
      // Show more months if month is ending
      const actualMonthsDisplayed = new Date(Date.now()).getDate() > 20 ? this.monthsDisplayed + 1 : this.monthsDisplayed
      for (let i = 0; i < actualMonthsDisplayed; i++) {
        indexes.push(i)
      }
      return indexes.map((arg, index) => {
        const dateOnIndex = addMonths(new Date(Date.now()), index)
        const thisMonth = dateOnIndex.getMonth()
        const thisYear = dateOnIndex.getYear()
        return { month: thisMonth, label: this.monthNames[thisMonth], days: getDaysInMonth(new Date(thisYear, thisMonth)) }
      })
    },
    maximumMonthsOnScreen () {
      return Math.max(...this.displayOptions.filter(option => option.breakpoint < this.windowWidth).map(option => option.value))
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
      // Init
      this.handleResize()
    })
  },
  methods: {
    handleResize () {
      this.windowWidth = document.documentElement.clientWidth
      if (this.monthsDisplayed > this.maximumMonthsOnScreen) {
        this.monthsDisplayed = this.maximumMonthsOnScreen
      }
    },
    getProgressBarValues (startDate, dates) {
      let accumulatedDays = 0

      const leaveDates = this.calculateLeaveDays(dates)
      return Object.values(this.monthData).map((month, monthIndex) => {
        // Handle first month: remove number of days already passed
        const numberOfDaysInMonth = monthIndex === 0 ? month.days - new Date(Date.now()).getDate() : month.days

        const progressBar = { values: [], showEndLabel: false, showStartLabel: false }
        const currentMonthsLeaves = leaveDates.filter(leave => {
          return leave.startDay < accumulatedDays + numberOfDaysInMonth && leave.endDay >= accumulatedDays
        })

        currentMonthsLeaves.forEach(leave => {
          let numDays = leave.numDays

          // Handle utilization changes on month start and end
          if (leave.startDay < accumulatedDays) {
            numDays -= (accumulatedDays - leave.startDay)
          }
          if (leave.endDay > accumulatedDays + numberOfDaysInMonth) {
            numDays -= (leave.endDay + 1 - (accumulatedDays + numberOfDaysInMonth))
          }
          progressBar.values.push({
            daysLeft: numDays,
            description: leave.description,
            style: { opacity: leave.value ? 1 : 0 }
          })
        })
        accumulatedDays += numberOfDaysInMonth
        return progressBar
      })
    },
    calculateLeaveDays (absences) {
      const todaysDate = new Date().setHours(0, 0, 0, 0)
      const dates = []
      // Array of unique start and end dates
      const uniqueStartAndEndDates = new Set([
        ...absences.map(absence => new Date(absence.startDate).setHours(0, 0, 0, 0)),
        ...absences.map(absence => addDays(new Date(absence.endDate || addMonths(todaysDate, this.monthsDisplayed)).setHours(0, 0, 0, 0), 1))
      ])
      // Filter dates in the past from the array and sort it
      const dateSteps = Array.from(uniqueStartAndEndDates).filter(date => date > todaysDate).sort((a, b) => a - b)
      let isPreviousALeave
      // Start iteration with todays date
      for (const date of [todaysDate, ...dateSteps]) {
        let isALeave = false
        let description
        absences.filter(absence => {
          const endDate = new Date(absence.endDate || addMonths(todaysDate, this.monthsDisplayed))
          return new Date(absence.startDate).setHours(0, 0, 0, 0) <= date && endDate >= date
        })
          .forEach(absence => {
            isALeave = !!absence.id
            description = `${this.leaveById(absence.leaveId).description} ${format(absence.startDate, 'DD.MM.')} - ${absence.endDate ? format(absence.endDate, 'DD.MM.') : ''}`
          })

        if (isPreviousALeave !== isALeave || isALeave) {
          dates.push({
            startDay: differenceInDays(date, todaysDate) - 1 > 0 ? differenceInDays(date, todaysDate) - 1 : 0,
            value: isALeave ? 100 : 0,
            description: description
          })

          if (dates.length > 1) {
            const currentIndex = dates.length - 1
            dates[currentIndex - 1].endDay = dates[currentIndex].startDay - 1
            dates[currentIndex - 1].numDays = dates[currentIndex - 1].endDay - dates[currentIndex - 1].startDay + 1
          }

          isPreviousALeave = isALeave
          description = undefined
        }
      }
      return dates.slice(0, -1)
    },
    openProfile (profileId) {
      this.$router.push({ name: 'profile', params: { id: profileId } })
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
  .profile-utilization-row {
    min-height: 58px;
  }
  .role-1 {
    background: $c-violet;
    border: 2px solid white;
  }
  .role-2 {
    background: $c-orange;
    border: 2px solid white;
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
</style>
