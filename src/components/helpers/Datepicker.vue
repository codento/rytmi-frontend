<template>
  <div>
    <input
      :id="element"
      ref="input"
      v-model="formattedValue"
      type="text"
      :class="'form-control ' + validationClass"
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
    value: Date,
    isValid:
      {
        type: Boolean,
        default: undefined
      }
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
    },
    validationClass: function () {
      switch (this.isValid) {
        case true:
          return 'is-valid'
        case false:
          return 'is-invalid'
        default:
          return ''
      }
    }
  },
  mounted () {
    this.createDatePicker()
  },
  beforeDestroy () {
    this.pikaday.destroy()
  },
  methods: {
    createDatePicker () {
      this.pikaday = new Pikaday({
        field: document.getElementById(this.element),
        format: 'D.M.YYYY',
        keyboardInput: false,
        onSelect: this.onSelect,
        yearRange: 30,
        firstDay: 1
      })
    },
    onSelect () {
      this.$emit('input', this.pikaday.getDate())
    },
    onBlurEvent () {
      // TODO Figure this out
      // this.$refs.input.value = format(this.pikaday.getDate(), 'D.M.YYYY')
    }
  }
}
</script>
