<template>
  <b-card >
    <div style="text-align: center;">
      <img src="https://www.placecage.com/c/150/175" />
    </div>
    <div style='text-align: center; color:#869fac'>

      <h2> {{basicInfo.name}} 
        <small ><br>{{basicInfo.title}}</small>
      </h2> 
      <i  style="padding: 4px;" v-for="account in basicInfo.accounts" class="fa fa-facebook" />
    </div>
    <div >
      <div class="profileCardDetails">
        Email: {{basicInfo.mail}}
      </div>
      <div class="profileCardDetails">
        Puhelinnumero: {{basicInfo.phone}}
      </div>
      <div class="profileCardDetails">
        Description: {{basicInfo.aboutMe}}
      </div>
    </div>
  </b-card>
</template>
<script>
export default {
  name: 'UserProfileCard',
  props: {
    'basicInfo': Object
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
