<template>
  <div class="my-4 animated fadeIn">
    <h1>Information for CV</h1>
    <hr>
    <CvInfoEditIntroduction :profile="profile" />
    <hr>
    <CvInfoEditEducation :profile="profile" />
  </div>
</template>

<script>
import CvInfoEditIntroduction from './CvInfoEditIntroduction'
import CvInfoEditEducation from './CvInfoEditEducation'

export default {
  name: 'CvInfo',
  components: {
    CvInfoEditIntroduction,
    CvInfoEditEducation
  },
  props: {
    profile: Object
  },
  data () {
    return {}
  },
  computed: {},
  methods: {}
}
</script>
