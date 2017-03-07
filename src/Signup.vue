<template>
  <div>
    <md-toolbar>
      <router-link tag="h1" class="md-title" style="flex: 1" to="/">Cloud Studies</router-link>
    </md-toolbar>
    <div class="signup">
      <h2>Create your account</h2>
      <p>We will never give your data to anyone.
        If you're still concerned,
        just don't provide an E-Mail address
        and choose a random username.</p>
      <form>
        <div class="username">
          <md-input-container class="input">
            <label>Username</label>
            <md-input type="text" v-model="username" required></md-input>
          </md-input-container>
          <md-spinner class="loading-random-spinner" :md-size="40" md-indeterminate v-show="loadingRandom"></md-spinner>
          <div v-show="!loadingRandom">
            <md-button class="md-icon-button" @click.native="randomName">
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
        <md-input-container>
          <label>Password</label>
          <md-input type="password" v-model="password" required></md-input>
        </md-input-container>
        <md-input-container>
          <label>repeat Password</label>
          <md-input type="password" v-model="repeatpassword" required></md-input>
        </md-input-container>
        <md-button class="md-accent md-raised md-focusfix btn-signup" type="submit">Sign up</md-button>
      </form>
      <div style="clear: both"></div>
      <div class="signin">
        <div class="text">
          Already have an account?
        </div>
        <md-button class="md-dense btn-signin" @click.native="$router.push('/')">Sign in</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        username: '',
        email: '',
        password: '',
        repeatpassword: '',
        loadingRandom: false
      }
    },
    methods: {
      randomName: function () {
        this.loadingRandom = true
        axios.get('https://users.api.cloudstudies.de/freename')
        .then(res => {
          this.username = res.data
          this.loadingRandom = false
        })
        .catch(e => {
          this.loadingRandom = false
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
    max-width: 400px;
  }
  .username {
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
