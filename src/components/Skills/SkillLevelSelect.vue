<template>
  <div>
    <div
      v-for="option in options"
      :key="option.value"
    >
      <b-row>
        <b-col>
          <b-form-radio
            v-model="selectedOption"
            :value="option.value"
          >
            {{ `${option.value} - ${option.text}` }}
          </b-form-radio>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="description"
          :class="selectedOption === option.value ? 'selected-description' : ''"
          @click="selectedOption = option.value"
        >
          {{ option.description }}
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SkillsLevelSelect',
  props: {
    options: {
      type: Array
    },
    initialValue: {
      type: Number
    }
  },
  data () {
    return {
      selectedOption: this.initialValue
    }
  },
  watch: {
    selectedOption (value) {
      this.$emit('optionSelected', value)
    }
  }
}
</script>

<style scoped>
.description {
  font-style: italic;
  font-size: 85%;
  color: gray;
  cursor: default;
}
.selected-description {
  color: black;
}
</style>
