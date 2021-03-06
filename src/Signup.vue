<template>
  <div>
    <md-toolbar>
      <router-link tag="h1" class="md-title" to="/">Cloud Studies</router-link>
    </md-toolbar>
    <div class="signup">
      <h2>Create your account</h2>
      <p>We will never give your data to anyone.
        If you're still concerned,
        just don't provide an E-Mail address
        and choose a random username.</p>
      <form v-on:submit.prevent="signup">
        <div class="combined-input">
          <md-input-container class="input" :class="{'md-input-invalid': errorUsername}">
            <label>Username</label>
            <md-input type="text" v-model="username" required></md-input>
            <span class="md-error">This username is already taken.</span>
          </md-input-container>
          <md-spinner class="loading-random-spinner" :md-size="40" md-indeterminate v-show="loadingRandom"></md-spinner>
          <div v-show="!loadingRandom">
            <md-button class="md-icon-button focusfix" @click.native="randomName">
              <md-icon md-src="src/assets/dice-multiple.svg"></md-icon>
              <md-tooltip>Generate random</md-tooltip>
            </md-button>
          </div>
        </div>
        <md-input-container>
          <label>E-Mail (optional)</label>
          <md-input type="text" v-model="email"></md-input>
        </md-input-container>
        <small>We will only use your E-Mail address if you forget your password.
          If you don't provide one, pick a password you won't forget.</small>
        <md-input-container md-has-password>
          <label>Password</label>
          <md-input type="password" v-model="password" pattern=".{8,}" required></md-input>
        </md-input-container>
        <md-button class="md-accent md-raised md-focusfix btn-signup" type="submit">Sign up</md-button>
      </form>
      <div style="clear: both"></div>
      <div class="signin">
        <div class="text">
          Already have an account?
        </div>
        <md-button class="md-dense btn-signin focusfix" @click.native="$router.push('/')">Sign in</md-button>
      </div>
    </div>
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
        email: '',
        password: '',
        loadingRandom: false,
        errorUsername: false
      }
    },
    methods: {
      randomName: function () {
        this.loadingRandom = true
        axios.get(config.API_USERS + '/freename')
        .then(res => {
          this.username = res.data
          this.loadingRandom = false
        })
        .catch(e => {
          this.loadingRandom = false
        })
      },
      signup: function () {
      const password = pwhash(this.password)
      const username = this.username
      const email = this.email ? this.email : null
        if (!username || !password) return
        axios.post(config.API_USERS + '/', {
          username,
          password,
          email
        })
        .then(res => {
          this.$store.dispatch('account/signup', Object.assign({}, res.data, {pw: password}))
          this.$router.push('/app/dashboard')
        })
        .catch(e => {
          // TODO: implement error handling
          errorUsername = true
          console.log(e)
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
  .signup {
    margin: 0 auto;
    padding: 24px;
    max-width: 500px;
  }
  .combined-input {
    display: flex;
    align-items: center;
    .input {
      flex-grow: 1;
    }
  }
  .loading-random-spinner {
    margin-left: 8px;
    margin-right: 8px;
  }
  .btn-signup {
    float: right;
  }
  .signin {
    display: flex;
    align-items: center;
    .text {
      flex-grow: 1;
    }
  }
</style>
