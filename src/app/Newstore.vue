<template lang="html">
  <div class="signup">
    <h2>Create a Store</h2>
    <p>The Store name will be public and can be found via the search function.</p>
    <form v-on:submit.prevent="signup">
      <div class="combined-input">
        <md-input-container class="input">
          <label>Name</label>
          <md-input type="text" v-model="username" required></md-input>
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
      <md-input-container>
        <label>Password</label>
        <md-input type="password" v-model="password" required></md-input>
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
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
</style>
