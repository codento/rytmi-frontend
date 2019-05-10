<template>
  <ul>
    <li
      v-for="detail in errorDetails"
      :key="detail"
      class="error-detail-row"
    >
      {{ parseErrorDetail(detail) }}
    </li>
  </ul>
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
