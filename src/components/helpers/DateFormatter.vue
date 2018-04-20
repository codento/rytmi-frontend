<template>
  <span v-if="date">
    {{new Date(date).toLocaleString(undefined, this.options)}}
  </span>
</template>
<script>
export default {
  name: 'DateFormatter',
  props: {
    date: String
  },
  data () {
    return {
      options: {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      }
    }
  }
}
</script>
