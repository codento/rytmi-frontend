<template>
  <div
    class="animated fadeIn container"
    style="margin-top: 24px">
    <b-jumbotron
      bg-variant="info"
      text-variant="white"
      border-variant="dark"
      header="404 sivua ei löytynyt" />
  </div>
</template>

<script>
export default {
  name: 'Login',
  mounted () {
    document.title = 'Rytmi - 404'
  }
}
</script>
