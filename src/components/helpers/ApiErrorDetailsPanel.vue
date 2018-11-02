<template>
  <div>
    <div
      v-for="detail in errorDetails"
      :key="detail"
      class="error-detail-row">
      <li>{{ parseErrorDetail(detail) }}</li>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ApiErrorDetailsPanel',
  props: {
    errorDetails: Array
  },
  methods: {
    parseErrorDetail (detail) {
      return detail.replace('.', ' ').replace('null', 'empty')
    }
  }
}
</script>
<style>

</style>
