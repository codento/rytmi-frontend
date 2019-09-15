<template>
  <b-form-group
    :invalid-feedback="invalidFeedback.join('\n')"
    :valid-feedback="validFeedback.show ? validFeedback.message : undefined"
    :state="!noValidation && dirtyField && dateString || validator.isValid === false ? invalidFeedback.length === 0 : undefined"
  >
    <b-input-group>
      <b-form-input
        v-model="dateString"
        type="text"
        class="form-control"
        autocomplete="off"
        :state="!noValidation && dirtyField && dateString || validator.isValid === false ? invalidFeedback.length === 0 : undefined"
        @blur="onBlurEvent()"
        @input="dirtyField = true"
        @change="onChange()"
      />
      <b-input-group-append>
        <b-button
          :id="element"
          ref="input"
          variant="light"
        >
          <CalendarIcon
            size="1x"
          />
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form-group>
</template>

<script>
import Pikaday from 'pikaday'
import { format, addYears } from 'date-fns'
import '../../assets/scss/vendors/pikaday/pikaday.css'
import { CalendarIcon } from 'vue-feather-icons'

const isBetween = (val, min, max) => {
  return val >= min && val <= max
}

const isValidDateString = (dateString) => {
  const splittedDate = dateString.split('.')
  if (splittedDate.length !== 3) {
    return false
  } else {
    const [day, month, year] = splittedDate

    if (isBetween(day, 1, 31) && isBetween(month, 1, 12) &&
      isBetween(year, 2000, addYears(new Date(), 20).getFullYear())) {
      return true
    }
    return false
  }
}

const dateStringToDate = (dateString) => {
  if (dateString) {
    const [day, month, year] = dateString.split('.')
    return new Date(`${year}-${month < 10 ? '0' + month.toString() : month}-${day < 10 ? '0' + day.toString() : day}`)
  }
  return null
}

export default {
  name: 'Datepicker',
  components: {
    CalendarIcon
  },
  props: {
    name: String,
    value: Date,
    defaultValue: {
      type: Date,
      default: undefined
    },
    minValue: {
      type: Date,
      default: undefined
    },
    maxValue: {
      type: Date,
      default: undefined
    },
    validator: {
      type: Object,
      default: () => {
        return { isValid: true, message: '' }
      }
    },
    noValidation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dateString: this.value ? format(this.value, 'D.M.YYYY') : null,
      dirtyField: false,
      datePicker: null,
      validFeedback: {
        show: false,
        message: null
      }
    }
  },
  computed: {
    element () {
      return `${this.name}-datepicker`
    },
    invalidFeedback () {
      const feedbackArray = []
      if (this.validator.isValid === false) {
        feedbackArray.push(this.validator.message)
      }
      if (this.dateString) {
        if (!isValidDateString(this.dateString)) {
          feedbackArray.push('Invalid date, should be: dd.mm.yyyy')
        }
      }
      return feedbackArray
    }
  },
  watch: {
    value () {
      this.dateString = this.value ? format(this.value, 'D.M.YYYY') : null
    },
    defaultValue () {
      // Move calendar view to default value if props change
      this.datePicker.gotoDate(this.defaultValue)
    },
    minValue () {
      this.datePicker.setMinDate(this.minValue)
    },
    maxValue () {
      this.datePicker.setMaxDate(this.maxValue)
    }
  },
  mounted () {
    const defaultValue = this.value || this.defaultValue
    this.createDatePicker(defaultValue, !!this.value)
  },
  beforeDestroy () {
    this.datePicker.destroy()
  },
  methods: {
    isValidDateString (dateString) {
      const splittedDate = dateString.split('.')
      if (splittedDate.length !== 3) {
        return false
      } else {
        const [day, month, year] = splittedDate

        const isBetween = (val, min, max) => {
          return val >= min && val <= max
        }

        if (isBetween(day, 1, 31) && isBetween(month, 1, 12) &&
          isBetween(year, 2000, addYears(new Date(), 20).getFullYear())) {
          return true
        }
        return false
      }
    },
    createDatePicker (defaultValue, setSelected) {
      this.datePicker = new Pikaday({
        field: document.getElementById(this.element),
        format: 'D.M.YYYY',
        keyboardInput: true,
        defaultDate: defaultValue,
        setDefaultDate: setSelected,
        minDate: this.minValue,
        maxDate: this.maxValue,
        onSelect: this.onSelect,
        yearRange: 30,
        firstDay: 1
      })
    },
    onSelect () {
      this.validFeedback.show = false
      this.dateString = format(this.datePicker.getDate(), 'D.M.YYYY')
    },
    onChange () {
      this.validFeedback.show = false
      if (this.invalidFeedback.length === 0) {
        if (this.dateString) {
          let dateValue = dateStringToDate(this.dateString)
          let dateChanged = false

          if (this.minValue && dateValue < this.minValue) {
            this.dateString = format(this.minValue, 'D.M.YYYY')
            dateValue = this.minValue
            dateChanged = true
            this.validFeedback.message = `Date changed to valid date, date can't be before ${format(this.minValue, 'D.M.YYYY')}`
          } else if (this.maxValue && dateValue > this.maxValue) {
            this.dateString = format(this.maxValue, 'D.M.YYYY')
            dateValue = this.maxValue
            dateChanged = true
            this.validFeedback.message = `Date changed to valid date, date can't be after ${format(this.maxValue, 'D.M.YYYY')}`
          }
          this.datePicker.setDate(dateValue)
          this.validFeedback.show = dateChanged
          this.$emit('input', dateValue)
        }
        this.$emit('input-state', true)
      } else {
        this.$emit('input-state', false)
      }
    },
    onBlurEvent () {
      // TODO Figure this out
      // this.$refs.input.value = format(this.datePicker.getDate(), 'D.M.YYYY')
    }
  }
}
</script>
