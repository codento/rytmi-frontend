<template>
  <span v-if="date">
    {{ formatted }}
  </span>
  <span v-else>
    TBD
  </span>
</template>

<script>

import moment from 'moment'

export default {
  name: 'DateFormatter',
  props: {
    date: String,
    format: {
      type: String,
      default: 'D.M.YYYY'
    }
  },
  computed: {
    formatted () {
      return moment(this.date).format(this.format)
    }
  }
}
</script>
