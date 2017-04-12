<template>
  <div>
    <md-toolbar>
      <h1 class="md-title">Cloud Studies</h1>
    </md-toolbar>
    <div class="signin">
      <h2>You need to sign in</h2>
      <p>Data uploaded to our service is encrypted and not visible without logging in.</p>
      <form v-on:submit.prevent="signin">
        <md-input-container :class="{'md-input-invalid': errorUsername}">
          <label>Username or E-Mail</label>
          <md-input type="text" v-model="username" required></md-input>
          <span class="md-error">Username/E-Mail not found</span>
        </md-input-container>
        <md-input-container :class="{'md-input-invalid': errorPassword}">
          <label>Password</label>
          <md-input type="password" v-model="password" pattern=".{8,}" required></md-input>
          <span class="md-error">Password is incorrect</span>
        </md-input-container>
        <div class="pwreset">
          <router-link to="/pwreset">Forgot your password?</router-link>
        </div>
        <md-button class="md-accent md-raised md-focusfix btn-signin" type="submit">Sign in</md-button>
      </form>
      <div style="clear: both"></div>
      <div class="signup">
        <div class="text">
          Need an account?
        </div>
        <md-button class="md-dense btn-signup focusfix" @click.native="$router.push('/signup')">Sign up</md-button>
      </div>
    </div>
    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="3000">
    <span>Error during login</span>
  </md-snackbar>
  </div>
</template>


<script>
  import axios from 'axios'

  import config from './config'
  import pwhash from './helpers/pwhash'

  export default {
    data () {
      return {
        username: '',
        password: '',
        errorPassword: false,
        errorUsername: false
      }
    },
    methods: {
      signin: function () {
        this.errorUsername = false
        this.errorPassword = false
        const password = pwhash(this.password)
        const username = this.username
        if (!username || !password) return
        axios.post(config.API_USERS + '/signin', {
          username,
          password
        })
        .then(res => {
          this.$store.dispatch('account/signin', Object.assign({}, res.data, {pw: password}))
          this.$router.push('/app/dashboard')
        })
        .catch(e => {
          console.log(e)
          if (e.response.status == 404)
            this.errorUsername = true
          else if (e.response.status == 403)
            this.errorPassword = true
          else
            this.$refs.snackbar.open()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .signin {
    margin: 0 auto;
    padding: 24px;
    max-width: 400px;
  }
  .btn-signin {
    float: right;
  }
  .signup {
    display: flex;
    align-items: center;
    .text {
      flex-grow: 1;
    }
  }
</style>
