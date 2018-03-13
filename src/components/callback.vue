<script>
import {mapActions} from 'vuex'

export default {
  mounted () {
    console.log('clalback')
    this.$nextTick(() => {
      this.fetchProfiles()
      this.fetchSkills()
      this.fetchProfileSkills()
      this.$router.push(this.$route.query.redirect || '/')
    })
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchSkills',
      'fetchProfileSkills'
    ])
  }
}
</script>