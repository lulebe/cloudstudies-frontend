<template>
  <div>
    <md-toolbar>
      <router-link tag="h1" class="md-title" to="/">Cloud Studies</router-link>
    </md-toolbar>
    <div class="reset">
      <h2>Password Reset</h2>
      <p>We will send a new password to your E-Mail address.
        This will only work if you provided an address during sign up.<br>
        <strong>Note:</strong> Resetting your password will delete your user
        data like passwords for Stores, so you'll have to re-enter your
        Store's passwords.
      </p>
      <md-button class="md-dense md-warn" id="btnOpenInfoDialog" @click.native="$refs.infoDialog.open()">more Information</md-button>
      <form v-on:submit.prevent="resetpw">
        <md-input-container>
          <label>E-Mail</label>
          <md-input type="email" v-model="email" required></md-input>
        </md-input-container>
        <md-button @click.native="$router.push('/')">back</md-button>
        <md-button class="md-accent md-raised md-focusfix btn-reset" type="submit">reset</md-button>
      </form>
    </div>
    <md-dialog md-open-from="#btnOpenInfoDialog" md-close-to="#btnOpenInfoDialog" ref="infoDialog">
      <md-dialog-title>Data removal</md-dialog-title>
      <md-dialog-content style="max-width: 600px;">
        <p>
          We still know which Stores you own, the files will be kept and others can still access
          them like before, but you'll need to re-enter the passwords for them, even if you decided
          to store those inside the app.
        </p>
        <dl>
          <dt><strong>What's lost</strong></dt>
          <dd>Stored passwords</dd>
          <dt><strong>What's kept</strong></dt>
          <dd>All Stores and files, tests and other data associated with them.</dd>
        </dl>
        <h4>Why?</h4>
        <p>
          Your password is encrypted before being stored on our server, so when you loose it,
          there is no way to decrypt information that was encrypted using that lost password.
          The Stored passwords as well as the information about which Stores you unlocked before
          is encrypted with that method, so that we have no way of decrypting it without you
          entering your password, so you'll have to unlock your Stores again using the Store's
          password.<br>
          All Stores have individual passwords, so their data will be kept, as well as ownership
          information about Stores you created and the files inside.
        </p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click.native="$refs.infoDialog.close()">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>


<script>
  import axios from 'axios'

  import config from './config'

  export default {
    data () {
      return {
        email: ''
      }
    },
    methods: {
      resetpw: function () {
        if (!this.email) return
        axios.post(config.API_USERS + '/resetpw', {
          email: this.email
        })
        .then(res => {

        })
        .catch(e => {

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-title:hover {
    cursor: pointer;
    color: white;
    text-shadow: 0 0 5px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
  .md-title:active {
    transform: translateY(0px);
  }
  .reset {
    margin: 0 auto;
    padding: 24px;
    max-width: 400px;
  }
  .btn-back {
    float: left;
  }
  .btn-reset {
    float: right;
  }
</style>
