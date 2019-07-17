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
            <ChevronUpIcon
              v-if="visibility"
              size="1.5x"
            />
            <ChevronDownIcon
              v-else
              size="1.5x"
            />
          </span>
        </b-button>
      </b-card-header>
      <b-collapse
        id="collapse"
        v-model="visibility"
      >
        <b-card-body>
          <slot />
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
import { ChevronDownIcon, ChevronUpIcon } from 'vue-feather-icons'
export default {
  name: 'CollapsableItem',
  components: {
    ChevronDownIcon,
    ChevronUpIcon
  },
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
