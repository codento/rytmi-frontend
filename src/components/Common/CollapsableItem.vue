<template>
  <div>
    <b-card
      no-body
      class="mb-1 rounded border-0"
    >
      <b-card-header
        class="p-1 btn-rytmi-light"
      >
        <b-button
          block
          variant="rytmi-light"
          @click="visibility = !visibility"
        >
          {{ title }}
          <span>
            <i
              :class="visibility ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"
            />
          </span>
        </b-button>
      </b-card-header>
      <b-collapse
        id="collapse"
        v-model="visibility"
      >
        <slot />
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'CollapsableItem',
  props: {
    title: String,
    initialVisibility: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visibility: this.initialVisibility
    }
  }
}
</script>
<style scoped >
  .btn {
    font-size: 18px;
    font-weight: 500;
  }
</style>
