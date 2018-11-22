<template>
  <div
    class="draw-border"
  >
    <div class="header-container">
      <slot name="header" />
    </div>
    <hr>
    <b-row>
      <slot />
    </b-row>
  </div>
</template>

<style scoped>
  .draw-border {
    height: 100%;
    border: 1px solid black;
  }
  .draw-border .header-container {
    padding-top: 15px;
    padding-left: 15px;
  }
</style>
