<template>
  <div>
    <input
      :id="element"
      ref="input"
      v-model="formattedValue"
      type="text"
      class="form-control"
      autocomplete="off"
      @blur="onBlurEvent"
    >
  </div>
</template>

<script>
import Pikaday from 'pikaday'
import { format } from 'date-fns'
import '../../assets/scss/vendors/pikaday/pikaday.css'

export default {
  name: 'Datepicker',
  props: {
    name: String,
    value: Date
  },
  computed: {
    element: function () {
      return `${this.name}-datepicker`
    },
    formattedValue: {
      get: function () {
        return this.value ? format(this.value, 'D.M.YYYY') : undefined
      },
      set: function () {
        return undefined
      }
    }
  },
  mounted () {
    this.createDatePicker()
  },
  methods: {
    createDatePicker () {
      this.pikaday = new Pikaday({
        field: document.getElementById(this.element),
        format: 'D.M.YYYY',
        keyboardInput: false,
        onSelect: this.onSelect
      })
    },
    onSelect () {
      this.$emit('input', this.pikaday.getDate())
    },
    onBlurEvent () {
      this.$refs.input.value = format(this.pikaday.getDate(), 'D.M.YYYY')
    }
  }
}
</script>
