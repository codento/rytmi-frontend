<template>
  <b-col
    :cols="size"
    :md="mdSize"
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
    size: {
      type: Number,
      default: 12
    },
    mdSize: {
      type: Number,
      default: 6
    }
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
