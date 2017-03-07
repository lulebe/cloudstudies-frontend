<template>
  <div>
    <md-toolbar>
      <h1 class="md-title">Cloud Studies</h1>
    </md-toolbar>
    <div class="signin">
      <h2>You need to sign in</h2>
      <p>Data uploaded to our service is encrypted and not visible without logging in.</p>
      <form v-on:submit.prevent="signin">
        <md-input-container>
          <label>Username or E-Mail</label>
          <md-input type="text" v-model="username" required></md-input>
        </md-input-container>
        <md-input-container>
          <label>Password</label>
          <md-input type="password" v-model="password" required></md-input>
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
        <md-button class="md-dense btn-signup" @click.native="$router.push('/signup')">Sign up</md-button>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from 'axios'

  import config from './config'
  import mainState from './state/main'

  export default {
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      signin: function () {
        if (!this.username || !this.password) return
        axios.post(config.API_USERS + '/signin', {
          username: this.username,
          password: this.password
        })
        .then(res => {
          mainState.commit('signin', res.data)
          this.$router.push('/app')
        })
        .catch(e => {
          console.log(e)
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
