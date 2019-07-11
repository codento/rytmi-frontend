<template>
  <div
    class="animated fadeIn container"
    style="margin-top: 24px"
  >
    <b-jumbotron
      :header="header"
      bg-variant="info"
      text-variant="dark"
      class="draw-shadow"
    />
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    'errorType': String
  },
  computed: {
    header: function () {
      switch (this.errorType) {
        case '404':
          return '404 page not found'
        default:
          return 'Something went wrong...'
      }
    }
  },
  mounted () {
    document.title = 'Rytmi - Error'
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.draw-shadow {
  box-shadow: 2px 2px darken($color: $body-bg, $amount: 5);
}
</style>
