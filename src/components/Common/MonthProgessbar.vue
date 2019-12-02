<template>
  <b-progress
    class="mt-4 project-progress"
    :max="monthData[monthIndex].days"
  >
    <b-progress-bar
      v-show="monthIndex === 0"
      class="hide-progress"
      :value="currentDayNumber()"
    />
    <b-progress-bar
      v-for="(progressBar, barIndex) in progressBarData.values"
      :id="`${name}-progress-${barIndex}-month-${monthIndex}-profile-${profileData.profile.id}`"
      :key="`${name}-progress-${barIndex}-month-${monthIndex}-profile-${profileData.profile.id}`"
      :value="progressBar.daysLeft"
      :style="progressBar.style"
    >
      <b-tooltip
        :target="`${name}-progress-${barIndex}-month-${monthIndex}-profile-${profileData.profile.id}`"
        :title="progressBar.description"
      />
    </b-progress-bar>
  </b-progress>
</template>
<script>
export default {
  name: 'MonthProgressbar',
  props: {
    progressBarData: Object,
    monthData: Array,
    monthIndex: Number,
    profileData: Object,
    name: String
  },
  methods: {
    currentDayNumber () {
      return new Date(Date.now()).getDate()
    }
  }
}
</script>
