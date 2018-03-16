<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <div id="gSignInWrapper">
          <span v-show="!isAuthenticated">
            <button id="customBtn" class="btn btn-primary btn-lg">Sign in with Google</button>
          </span>
          <span v-show="isAuthenticated">
            <button v-on:click="signOut" class="btn btn-secondary btn-lg">
              Logout
            </button>
          </span>
          <div id="name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
require('dotenv').config()

export default {
  data () {
    return {
      auth2: {}
    }
  },
  computed: mapGetters(['isAuthenticated']),
  methods: {
    isLoggedIn () {
      console.log('Is logged in ' + this.auth2.isSignedIn.get())
      if (this.auth2.isSignedIn.get() === true) {
        return true
      } else {
        return false
      }
    },
    attachSignin (element) {
      console.log(element.id)
      this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          this.$store.dispatch('login', {id_token: googleUser.getAuthResponse().id_token})
            .then(() => {
              this.$toasted.success('Successfully Login', {
                theme: 'bubble',
                position: 'top-right',
                duration: 5000
              })
            })
            .catch(() => {
              this.$toasted.error('Login failed, please login with codento mail! ', {
                theme: 'bubble',
                position: 'top-right',
                duration: 5000
              })
              this.revokeAllScopes()
            })
        }, (error) => {
          this.$toasted.error('Login failed' + error, {
            theme: 'bubble',
            position: 'top-right',
            duration: 5000
          })
        })
    },
    signOut (event) {
      /* eslint-disable */
      var auth = gapi.auth2.getAuthInstance()
      auth.signOut().then(() => {
        this.$store.dispatch('logout')
          .then(() => {
            this.$toasted.success('Successfully log out', {
              theme: 'bubble',
              position: 'top-right',
              duration: 5000
            })
            this.revokeAllScopes()
            this.initAuth2()
            this.attachSignin(document.getElementById('customBtn'))
          })
      })
      /* eslint-enable */
    },
    initAuth2 () {
      console.log('Cliend id: ' + process.env.CLIENT_ID)
      /* eslint-disable */
      this.auth2 = gapi.auth2.init({
        client_id: process.env.CLIENT_ID,
        cookiepolicy: 'single_host_origin'
      })
      /* eslint-enable */
    },
    revokeAllScopes () {
      this.auth2.disconnect()
    }
  },
  created () {
  /* eslint-disable */
    gapi.load ('auth2', () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    console.log('About to start init')
    this.initAuth2()
    this.attachSignin(document.getElementById('customBtn'))
    })
    /* eslint-enable */
  }
}
</script>
