<template>
  <div>
    <label :for="element">Date:</label>
    <input
      :id="element"
      type="text"
    >
    <label for="datepicker">Date:</label>
    <input
      id="datepicker"
      type="text"
    >
  </div>
</template>

<script>
import '../../../node_modules/pikaday/css/pikaday.css'
import Pikaday from 'pikaday'

export default {
  name: 'DateFormatter',
  props: {
    name: String
  },
  computed: {
    element: function () {
      return `${this.name}-datepicker`
    }
  },
  created () {
    const datepicker = this.createDatePicker(this.name)
  },
  methods: {
    createDatePicker (name) {
      require(['pikaday'], function(Pikaday) {
        var picker = new Pikaday({ field: document.getElementById('datepicker') });
        console.log('require', picker)
      });
      const pikkeri = new Pikaday({ field: document.getElementById(`${name}-datepicker`) })
      console.log(`${name}-datepicker`)
      console.log('import', pikkeri)
      pikkeri.setDate('2015-01-01')
      return pikkeri
    }
  }
}
</script>
