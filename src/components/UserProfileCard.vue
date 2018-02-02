<template>
  <b-card >
    <div style="text-align: center;">
      <img src="https://www.placecage.com/c/150/175" />
    </div>
    <div style='text-align: center; color:#869fac'>
      <h2> {{getNames}} 
        <small ><br>{{profile.title}}</small>
      </h2> 
      <a style="padding: 4px;" v-for="account in profile.accounts" class='fa' :class='getFAClass(account)' :href='account.address'/>
    </div>
    <div >
      <div class="profileCardDetails">
        Email: {{profile.email}}
      </div>
      <div class="profileCardDetails">
        Puhelinnumero: {{profile.phone}}
      </div>
      <br/>
      <div class="profileCardDetails">
        {{profile.description}}
      </div>
    </div>
  </b-card>
</template>
<script>
export default {
  name: 'UserProfileCard',
  props: {
    'profile': Object
  },
  computed: {
    getNames: function () {
      return this.profile.firstName + ' ' + this.profile.lastName
    }
  },
  methods: {
    getFAClass: function (object) {
      return 'fa-'.concat(object.type)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
