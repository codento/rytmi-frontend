<template>
<div class="container">
  <div id="gSignInWrapper">
  <span class="label">Sign in with:</span>
    <div id="customBtn" class="customGPlusSignIn">
      <span class="icon"></span>
      <span class="buttonText">Google</span>
    </div>
    <div id="name"></div>
  </div>
  <a href="#" class="btn btn-alert" v-on:click="signout" v-show="isLoggedIn">Sign out</a>
</div>
</template>
<script>

export default {
  data () {
    return {
      auth2: {}
    }
  },
  methods: {
    onSuccess (googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName())
    },
    onFailure (error) {
      console.log(error)
    },
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
          console.log('ID Token: ' + googleUser.getAuthResponse().id_token)
          console.log('Email ' + googleUser.getBasicProfile().getEmail())
          document.getElementById('name').innerText = 'Signed in: ' +
              googleUser.getBasicProfile().getName()
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2))
        })
    },
    signout (event) {
      console.log('Is logged in ' + this.auth2.isSignedIn.get())
      console.log('End of an Era ' + this.auth2.currentUser.get())
      /* eslint-disable */
      var auth = gapi.auth2.getAuthInstance()
      auth.signOut().then(() => {
        console.log('User signed out.')
      })
      /* eslint-enable */
    }
  },
  created () {
  /* eslint-disable */
    gapi.load ('auth2', () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    console.log('About to start init')
     this.auth2 = gapi.auth2.init({
       client_id: '487139903401-9u7854e8ainjhu5775s7s2ed3au5fj3e.apps.googleusercontent.com',
       cookiepolicy: 'single_host_origin'
     })
     this.attachSignin(document.getElementById('customBtn'))
    })
    /* eslint-enable */
  }
}
</script>
<style type="text/css">
    #customBtn {
      display: inline-block;
      background: white;
      color: #444;
      width: 190px;
      border-radius: 5px;
      border: thin solid #888;
      box-shadow: 1px 1px 1px grey;
      white-space: nowrap;
    }
    #customBtn:hover {
      cursor: pointer;
    }
    span.label {
      font-family: serif;
      font-weight: normal;
    }
    span.icon {
      background: url('/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
      display: inline-block;
      vertical-align: middle;
      width: 42px;
      height: 42px;
    }
    span.buttonText {
      display: inline-block;
      vertical-align: middle;
      padding-left: 42px;
      padding-right: 42px;
      font-size: 14px;
      font-weight: bold;
      /* Use the Roboto font that is loaded in the <head> */
      font-family: 'Roboto', sans-serif;
    }
  </style>
