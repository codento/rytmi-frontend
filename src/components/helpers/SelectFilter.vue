<template>
  <div class="d-inline px-2">
    <b-dropdown text="Skill selection">
      <b-dropdown-item
        v-for="option in options"
        :key="option.value"
        @click="selectValue(option.value)">
        <span
          v-if="isSelected(option.value)"
          class="cui-check"
          aria-hidden="true"/>
        {{ option.text }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    heading: String,
    options: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    }
  },
  methods: {
    isSelected (value) {
      return this.selected.includes(value)
    },
    selectValue (value) {
      this.$emit('item-clicked', value)
    }
  }
}
</script>

<style scoped>
.scrollable {
  max-height: 300px;
  overflow-y: scroll;
}
.cui-check {
  color: green;
}
</style>
