<template>
  <b-col
    :cols="size"
    class="draw-border">
    <div class="header-container">
      <slot name="header"/>
    </div>
    <hr>
    <b-row>
      <slot/>
    </b-row>
  </b-col>
</template>

<script>
export default {
  props: {
    size: Number
  }
}
</script>

<style scoped>
  .draw-border {
    border: 1px solid black;
  }
  .draw-border .header-container {
    padding-top: 15px;
    padding-left: 15px;
  }
</style>
